import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ENV } from '../config/env';
import { IvrStateMachine } from '../services/ivrStateMachine';
import { PromptService, IvrLanguage } from '../services/promptService';

/**
 * Single Unified Webhook for Inbound Call & All DTMF Gather Steps (POST /api/ivr/webhook & /api/ivr/incoming)
 */
export const handleIvrWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || req.body.callSid || `CALL_${Date.now()}`);
    const fromPhone = String(req.body.From || req.query.From || req.body.fromPhone || req.body.from || '9848012345')
      .replace(/[^0-9]/g, '')
      .slice(-10) || '9848012345';
    const digits = String(req.body.Digits || req.query.Digits || req.body.digits || '').trim();

    // Determine host base URL for TwiML action routing
    const protocol = req.protocol || 'https';
    const host = req.get('host');
    const requestBaseUrl = host ? `${protocol}://${host}` : ENV.BACKEND_URL;

    const result = await IvrStateMachine.processInput({
      callSid,
      fromPhone,
      digits,
      baseUrl: requestBaseUrl,
    });

    res.type('text/xml').send(result.twiml);
  } catch (error) {
    next(error);
  }
};

/**
 * Status Callback Webhook (POST /api/ivr/status-callback)
 */
export const handleStatusCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const callSid = String(req.body.CallSid || req.query.CallSid || '');
    const callDuration = parseInt(String(req.body.CallDuration || req.query.CallDuration || '0'), 10);
    const callStatus = String(req.body.CallStatus || req.query.CallStatus || 'COMPLETED');

    if (callSid) {
      await prisma.call.updateMany({
        where: { callSid },
        data: {
          duration: callDuration,
          status: callStatus.toUpperCase(),
          endTime: new Date(),
        },
      });

      await prisma.ivrSession.updateMany({
        where: { callSid },
        data: {
          sessionStatus: callStatus === 'COMPLETED' ? 'COMPLETED' : 'ABANDONED',
          lastActivity: new Date(),
        },
      });
    }

    res.type('text/xml').send('<Response><Hangup/></Response>');
  } catch (error) {
    next(error);
  }
};

/**
 * Interactive In-Browser & Automated Test Simulator (POST /api/ivr/simulate)
 */
export const handleSimulateIvr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { callSid, fromPhone, digits, language } = req.body;
    const sessionCallSid = String(callSid || `CALL_SIM_${Date.now()}`);
    const callerPhone = String(fromPhone || '9848012345').replace(/[^0-9]/g, '').slice(-10) || '9848012345';

    // If explicit language provided on start
    if (language) {
      await prisma.ivrSession.upsert({
        where: { callSid: sessionCallSid },
        update: { language },
        create: {
          callSid: sessionCallSid,
          fromPhone: callerPhone,
          language,
          currentState: 'LANGUAGE_SELECTION',
        },
      });
    }

    const result = await IvrStateMachine.processInput({
      callSid: sessionCallSid,
      fromPhone: callerPhone,
      digits: digits !== undefined ? String(digits) : '',
    });

    res.status(200).json({
      success: true,
      callSid: sessionCallSid,
      currentState: result.nextState,
      language: result.session.language,
      prompt: result.promptText,
      twiml: result.twiml,
      session: result.session,
    });
  } catch (error) {
    next(error);
  }
};
