## Client

We'll be using the standard: 
- next 
- react query for client requests 
- zustand for state management 
- tailwind for styling
- storybook for testing components
- playwright to do e2e testing

About next: We are using next.js only for the dynamic metadata and first painting. We are not troubling with server actions or any weird routing(only parallel for minimized room). The approach is to make the first fetch on the server for a quick first paint and prefetch features and then do everything else on the client.  

[Figma design](https://www.figma.com/design/EYc2ru2yxlHRF6Huxv7zcB/glimmer?node-id=0-1&t=wekKWn1YH8LVfnqd-0)