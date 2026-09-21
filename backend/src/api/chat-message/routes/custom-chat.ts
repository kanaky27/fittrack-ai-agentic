export default {
  routes: [
    {
      method: 'POST',
      path: '/chat',
      handler: 'api::chat-message.chat-message.chat'
    }
  ]
};
