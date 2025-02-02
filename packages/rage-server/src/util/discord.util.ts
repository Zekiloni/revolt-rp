import axios from 'axios';


export const sendDiscordWebhook = async (endpoint: string, author: {
  username: string,
  avatar?: string
}, content: string | DiscordEmbed[]) => {
  const body: DiscordWebhookPayload = {
    ...author
  };

  if (typeof content === 'string') {
    body.content = content;
  } else {
    body.embeds = content;
  }

  await axios.post(endpoint, body, {
    headers: { 'Content-Type': 'application/json' }
  });
};


