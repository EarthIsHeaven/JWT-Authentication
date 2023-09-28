# JWT-Authentication

1. To access protected route 

Using Postman

Follow these commands:-

GET localhost:3000/protected

In the "Headers" tab, add a new header with the key "Authorization" and the value "your_generated_token_here" replace your_generated_token_here with the actual token you copied from /login route.

2. To logout (Expire the token)

Using postman

Follow these commands:-

Post localhost:3000/logout

In the "Headers" tab, add a new header with the key "Authorization" and the value "your_generated_token_here" replace your_generated_token_here with the actual token you copied from /login route.