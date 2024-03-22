// const Page = require('puppeteer/lib/Page')

// Page.prototype.login = async function () {
//     const user = await userFactory()
//     const { session, sig } = sessionFactory(user);

//     await page.setCookie({ name: 'session', value: session })
//     await page.setCookie({ name: 'session.sig', value: sig })
//     await page.goto('localhost:3000')
//     await page.waitFor('a[href="/auth/logout"]')
// }