import { PromptService, IvrLanguage, PROMPTS } from './promptService';
import { IvrStateMachine } from './ivrStateMachine';
import prisma from '../config/prisma';

export { PromptService, IvrLanguage, PROMPTS, IvrStateMachine };

export async function getIvrProductMenuText(language: IvrLanguage) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  });
  const text = IvrStateMachine.buildProductMenuPrompt(products, language);
  return { text, products };
}

export async function getIvrVariantMenuText(productId: string, language: IvrLanguage) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { where: { isActive: true }, orderBy: { price: 'asc' } } },
  });
  if (!product) return null;
  const text = IvrStateMachine.buildVariantMenuPrompt(product, language);
  return { text, product, variants: product.variants };
}

export function buildTwimlResponse(options: any) {
  return IvrStateMachine.generateTwiML({
    say: options.say,
    language: options.language || 'ENGLISH',
    gatherDigits: options.numDigits || (options.gatherAction ? 1 : undefined),
    gatherTimeout: options.timeout || 6,
    dialNumber: options.dialNumber,
    hangup: options.hangup,
    actionUrl: options.gatherAction,
  });
}
