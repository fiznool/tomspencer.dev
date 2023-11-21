---
categories:
- thoughts
pubDate: "2018-03-23T21:34:10Z"
description: I've recently decided to take the plunge and migrate my site to Hugo.
title: Migrating to Hugo
---

Over the past 4 years, this site has been managed by [Octopress](http://octopress.org/) - which has served me very well.

Unfortunately, I've been unable to write any content for some time now. This is due to an upgrade to my laptop, moving from Ubuntu to Mac - as a result, I needed to reinstall a lot of things, and the (old) version of Octopress I was using no longer works with the latest Ruby.

I was faced with a decision:

- Migrate to the latest version of Octopress
- Move to another static site framework

After some research on [StaticGen](https://www.staticgen.com/) I saw that [Hugo](https://gohugo.io/) has gained a lot of momentum over the last couple of years, becoming the second-most popular tool (after Jekyll). It promises to be blazing fast, which would make a nice change, as Octopress was becoming a bit slow. In addition to this, Octopress appears to be no longer maintained - the last post on the homepage is almost three years old.

I spent an hour or so testing out Hugo and was very happy with the results. After installing a [theme](https://themes.gohugo.io/hugo-goa/) and tweaking it, I was ready to import my posts from Octopress. Since I have < 20 posts, this was fairly simple to achieve as a manual process. Within just a few hours, I had moved over all content, and the site was ready to be deployed.

Here, I had another decision to make. My previous site was hosted on [Github Pages](https://pages.github.com/), which worked well and was nice and fast, but unfortunately doesn't support https for custom domains. With the recent news that [Chrome will start penalising sites that don't work over https](https://security.googleblog.com/2018/02/a-secure-web-is-here-to-stay.html), given that over 80% of my site's visitors are using Chrome, I was keen to avoid any penalities.

<img src="/images/2018-03-23-migrating-to-hugo/browser-analytics.png" alt="Screenshot of browser analytics" />
<small><em>Browser Analytics for 30 days to March 23. Thankfully I don't need to worry too much about IE!</em></small>

As a quick fix, I threw CloudFront in front of the site, which gave me https for nothing. While this worked, it felt a little clunky - GitHub Pages should support this out of the box, without needing to use a separate service.

Enter [Netlify](https://www.netlify.com/). I first came across Netlify a couple of years ago when looking for a static site host for [Flow XO](https://flowxo.com). Since then, the service has added many features, including support for https on custom domains, backed by Let's Encrypt.

Netlify seemed like the best option, so I set about creating a new site and pointing my domain registrar's DNS to the Netlify servers. This was really painless and within a few hours, tomspencer.dev was being hosted by Netlify. I then enabled https, a process which took less than 30 seconds.

I'm really happy with the new setup. Hugo seems to be a great choice for managing the site, in particular it uses markdown for content authoring, which I'm very familiar with. On the hosting side, Netlify makes things so simple and the site is blazing fast.

Hopefully I will now have the momentum to blog a bit more frequently!
