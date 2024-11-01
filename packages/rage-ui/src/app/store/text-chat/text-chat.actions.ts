import { createAction, props } from '@ngrx/store';
import { TextChatMessage } from './text-chat.model';

export const push = createAction('[Chat] Add Message', props<TextChatMessage>());

export const clearChat = createAction('[Chat] Clear Chat');
