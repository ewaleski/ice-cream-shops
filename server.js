const express = require('express');
const yelp = require('yelp-fusion');

const app = express();
const port = process.env.PORT || 5000;
const client = yelp.client('Nw9uahHCr1i_zCZU1JrMo4hfo9n0M8jd2W3SdyfEW4eE_MlTaEg00TUTprOrRS214FkECmMvfkJmRoHsY2UrA0N_MiDmD95eSL7bRUugegcxP6_jsO5oenQFvmPwYXYx');

const LOCATION = 'Alpharetta, GA';
const TERM = 'ice cream';
const LIMIT = 5;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/api/get-shops', async(req, res) => {
    // Gets the top 5 ice cream shops
    const getShops = async(location, term, limit) =>
    {
        let response = await client.search({
            location: LOCATION,
            term: TERM,
            sort_by: 'rating',
            limit: LIMIT,
        })
        return response.jsonBody.businesses;
    };

    // Gets the shop's review
    const getReviews = async(shop) =>
    {
        let reviewsResponse;

        reviewsResponse = await client.reviews(shop.id);
        const reviews = reviewsResponse.jsonBody.reviews;

        for (let i = 0; i < reviews.length; i++)
        {
            if (reviews[i].rating == 5)
            {
                return reviews[i];
            }
        }
    };

    // Displays the shop's info and review
    const displayShops = async(shops) =>
    {
        let listOfShops = [];
        for (const shop of await shops)
        {
            let review = await getReviews(shop);
            
            const shopInfo = {
                name: shop.name,
                address: shop.location.address1,
                city: shop.location.city,
                image: shop.image_url,
                review: review.text.split("\n").join(),
                reviewerName: review.user.name,
                reviewRating: review.rating
            };
            listOfShops.push(shopInfo);
        }
        return listOfShops;
    };

    const shops = await getShops(LOCATION, TERM, LIMIT);
    const results = await displayShops(shops);

    res.send({ results });
});
