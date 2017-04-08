const URL         =   "localhost"
const PORT        =   27017
const DB          =   "selene"
const IMAGES      =   "images"
const ANGLES      =   "image_angles"

const express =   require("express");
const router  =   express.Router();
const monk    =   require("monk");
const db      =   monk(`${URL}:${PORT}/${DB}`);

router.get('/images', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);


  images.find({}, { limit:40  , fields: "pts.loc" }, (err, items) => {
    if(items.length > 0) {
      data["error"]   =   0;
      data["Images"]  =   items;
      res.json(data);
    }
    else {
      data["error"]   =   1;
      data["Images"]  =   "No Images Found";
      res.json(data);
    }
  });
});

router.get('/near/:lat/:lng', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);

  let lat = parseFloat(req.params.lat);
  let lng = parseFloat(req.params.lng);

  images.find({"loc" : {$near:{$geometry:{"type": "Point", "coordinates" : [ lat, lng ] }}}},
              { limit:40  , fields: "pts.loc" }, (err, items) => {
                if(items.length > 0) {
                  data["error"]   =   0;
                  data["Images"]  =   items;
                  res.json(data);
                }
                else {
                  data["error"]   =   1;
                  data["Images"]  =   "No Images Found";
                  res.json(data);
                }
              });
});

router.get('/incidence/:angle', (req, res) => {
  let data    =   {};
  let angles  =   db.get(ANGLES);

  let lat = parseFloat(req.params.angle);
  let lng = 2.49;

  angles.find({"loc" : {$near:{$geometry:{"type": "Point", "coordinates" : [ lat, lng ] }}}},
              { limit:40  , fields: "pts.loc" }, (err, items) => {
                if(items.length > 0) {
                  data["error"]   =   0;
                  data["Images"]  =   items;
                  res.json(data);
                }
                else {
                  data["error"]   =   1;
                  data["Images"]  =   "No Images Found";
                  res.json(data);
                }
              });
});

router.get('/image/:id/:in', (req, res) => {
  let data    =   {};
  let images  =   db.get(IMAGES);


  images.find({_id: req.params.id }, { fields: " pts.ref1 pts.ref2 " }, (err, items) => {
    if(items.length > 0) {
      data["error"]   =   0;
      data["Image"]  =   items[0].pts[req.params.in];
      res.json(data);
    }
    else {
      data["error"]   =   1;
      data["Images"]  =   "No Image Found";
      res.json(data);
    }
  });
});

module.exports = router;
