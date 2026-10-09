# Publish your portfolio

The site is designed to run as one Node.js web service: Express serves both the built React page and the API, and MongoDB Atlas supplies the database. GitHub stores your editable source code. GitHub Pages alone cannot run the Express server or MongoDB connection.

You will need a GitHub account, a [MongoDB Atlas](https://www.mongodb.com/atlas) account, and a [Render](https://render.com/) account. Review each provider's current terms, free-tier limits, and pricing before choosing a plan. No hosting account, database, paid plan, or domain is created merely by adding these files to the repository.

## 1. Prepare MongoDB Atlas

1. Create an Atlas project and a cluster. Choose a free option if available and appropriate for your needs.
2. Under **Database Access**, create a database user with read/write permission limited to a database named `personal_website`. This is separate from your Atlas account login.
3. Choose **Connect → Drivers** for your cluster and copy its Node.js connection string. Use your database username and password and include the database name, for example `/personal_website` before any query parameters. Follow Atlas's instructions for URL-encoding special characters in a password.
4. Keep the completed URI private. It goes into Render's secret environment settings, never into GitHub or chat.

Atlas also requires a **Network Access** rule for your web host. Add the outbound IP addresses or CIDR ranges shown for your particular Render service, using the actual values from its dashboard. The service may need to be created first so you can see those addresses. Prefer those specific ranges over allowing every internet address. If Render changes your service region or egress addresses later, update Atlas accordingly.

## 2. Create the Render web service

The repository includes `render.yaml`, which chooses a free web service and requests your private MongoDB connection string. Free services may sleep when idle, so a first visit can take longer to load. You can choose a different plan in your account if you want different availability; check the price before confirming.

To use the configuration:

1. In Render, choose **New → Blueprint** and connect `jksatermo/personal-website`. Allow Render to read this repository.
2. Use the `main` branch. Review the service configuration found in `render.yaml`.
3. Enter your Atlas connection string as `MONGODB_URI` when prompted. Do not put the value in `render.yaml`.
4. Create the service. Find its outbound network addresses in the service dashboard and add them to Atlas Network Access as described above.
5. If the first deployment failed because Atlas did not yet allow the connection, deploy the latest commit again after saving the network rule.

Alternatively, create **New → Web Service**, connect the same repository, and enter these values yourself:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Runtime | Node |
| Root directory | Leave blank |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| `NODE_VERSION` | `24` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your private Atlas connection string |

The build needs the development dependencies because Vite compiles React. `--include=dev` ensures those tools are installed even when `NODE_ENV=production`. Render supplies `PORT` automatically; the server listens on that port and on `0.0.0.0`. Do not run `npm run dev` on the host: production uses Atlas rather than the local development database helper.

At startup, the server copies `content/portfolio.json` into MongoDB. A separate seed command is not required. The service becomes healthy only after its database connection succeeds.

## 3. Check the live address

Once Render reports a successful deployment, open the HTTPS address it assigns, such as `https://your-service-name.onrender.com`. Use the actual address shown in your dashboard.

- Check the page on your phone and computer, including all three section links and the social links.
- Visit `/api/health` at that address. It should report `"status":"ok"` and `"database":"connected"`.
- Visit `/api/portfolio` to confirm the public content API responds.
- Confirm that both unfinished projects are still marked **Coming soon** until you publish them.

If a deployment fails, read the Render logs. For database errors, verify the database username/password, database permissions, cluster availability, and Atlas network rules. For build errors, confirm Node 24 and the exact build command above. Do not paste a database connection string into public logs, issues, or screenshots.

## 4. Add a domain you own

`jackson.satermo.com` means “the `jackson` subdomain under `satermo.com`.” A subdomain cannot be independently registered through a registrar. You currently do not own `satermo.com`, so this exact address would require the current owner's cooperation or acquiring control of that parent domain.

You can publish immediately using Render's supplied URL. If you want a personal domain later:

1. Search for an available domain at a registrar. Names such as `jacksonsatermo.com` or `jacksonsatermo.dev` are ideas only; their availability and prices have not been checked.
2. Review the purchase and renewal prices, then register the domain in your own account. Keep access to that account and enable two-factor authentication.
3. Open your Render service's **Settings → Custom Domains**, add your chosen hostname, and copy the DNS instructions Render shows.
4. In the registrar's DNS settings, add the exact record type, hostname, and target that Render provides. A subdomain commonly uses a CNAME; a root domain may use different records. Do not guess IP addresses or copy an example target.
5. Return to Render and verify the domain. DNS changes can take time. Wait until verification and the HTTPS certificate both complete before sharing the custom address.

Leave unrelated DNS records, especially email records, in place. Render handles HTTPS after the domain is correctly connected. You do not need to hardcode the hostname in the application because the browser accesses the API through the same origin.

## 5. Keep it updated

Edit `content/portfolio.json` on GitHub or in your local editor, commit the changes, and push to `main`. If automatic deployment is enabled, Render rebuilds the app and starts the new version. Otherwise, use **Manual Deploy → Deploy latest commit**.

Changing content also rebuilds the bundled fallback shown before the API responds. Do not update the production database directly as your normal editing workflow: the next application startup restores the content from the JSON file.

Keep MongoDB credentials in the host's environment settings. If you change a database password, update `MONGODB_URI` there and restart or redeploy the service. Keep dependencies updated over time and run `npm test` and `npm run build` before publishing code changes.
