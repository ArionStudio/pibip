# FOR WEBSOCKET PRIVILAGES
curl -X POST 'https://id.twitch.tv/oauth2/token' \
  -d 'client_id=' \
  -d 'client_secret=' \
  -d 'grant_type=client_credentials' \
  -d 'scope=bits:read channel:bot channel:read:ads channel:read:goals channel:read:hype_train channel:read:polls channel:read:predictions channel:read:redemptions channel:read:subscriptions channel:read:vips'                                                                              


https://id.twitch.tv/oauth2/authorize?client_id=&redirect_uri=http://localhost&response_type=code&scope=moderator:read:followers,channel:read:ads,user:bot,user:read:chat,channel:bot,channel:read:subscriptions,bits:read,channel:read:redemptions,channel:read:polls,channel:read:predictions,channel:read:goals,channel:read:hype_train

https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=eogww917eycg31gfp4t82r9dh8y1wf&redirect_uri=http://localhost&scope=moderator:read:followers+channel:read:ads+user:bot+user:read:chat+channel:bot+channel:read:subscriptions+bits:read+channel:read:redemptions+channel:read:polls+channel:read:predictions+channel:read:goals+channel:read:hype_train