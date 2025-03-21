export const htmlToPlainText = (html: string) => html.replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '');
