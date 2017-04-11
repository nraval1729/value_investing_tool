Our project is a data-driven application that sources 
near real-time stock market data, peforms calculatios,
and provides the user with visualization and data can help 
them make investing decisions centered around a form
of investing known as value investing (details regarding
this will be provided in our about.html page).

For this 4/12 deliverable, the backend is elided.  
What is presented here is a version that uses a small, 
local data set that allows you to get a feel for our
front end.

To get a feel for our site, we recommend the
following two journeys:

1) Get a feel for our static pages:  Start at
index.html.  Scroll down, click on the the various
boxes.  Click on the navigation at the top of the 
pages as well. Our static pages are the following:
index.html
about.html
search.html
privacy_policy.html.

2) Get a feel for the dynamic data aspects of our site:
-Start at explore.html.  This will show you the overall
market sectors.
-Click on the Utilities table cell.  This will show you the industries
that belong to the utilities sector.
-Click on Electric Utilities table cell.  This will be a heatmap
page that shows you the data and performance for companies
that belong to the electric utitilies industry.
-The columns are sortable in the heatmap. Click on any cell in the 
top row of the table to sort ascending/descending on that attribute.

Some technical notes regarding the heatmap:
P/E: price-to-earnings ratio
P/S: price-to-sales ratio
P/CF: price-to-cashflow ratio
DIV: dividend yield (percentage)
RANK: how well stock is performing in relation to the overall market

Notes regarding heatmap table cell coloring:
Bright red: for this metric, the stock is currently performing much worse than its five-year average
Dark Red: for this metric, the stock is currently performing worse than its five-year average
Black: for this metric, the stock is currently performing at or near its five-year average
Dark Green: for this metric, the stock is currently performing better than its five-year average
Bright Green: for this metric, the stock is currently performing much better than its five-year average

The rank cells are all black as it would not make sense to color them.

For our demo purposes, we are using a limited data set.  This means, that which ever path you take
through our exploration grid, you will end up with the electric uitilities data in the heatmap.

Notes regarding the exploration interface:
Breadcrumbs allow you to travel backwards, and let you know where you are at contextually.

Other notes:
The search page is a mockup.  The search bar does not do anything currently.
The about.html and privacy_policy.html pages currenltly have placeholder content only.