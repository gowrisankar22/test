const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const {
  MONGO_URL,
  MONGO_DATABASE,
  MONGO_USERNAME,
  MONGO_PASSWORD
}  = process.env;
const app = express();
app.use(cors());
app.use(express.json());
const PoiSchema = mongoose.Schema({
  name: String,
  position: {
    lat: Number,
    lon: Number
  }
});
const Poi =  mongoose.model("Poi", PoiSchema);
app.get('v1/all', async (req, res) => {
  const allPois = await Poi.find().exec();
  return res.json({ msg: "Pois", data: allPois });
});
app.post('v1/add', async (req, res) => {
  await new Poi(req.body).save();
  return res.json({ msg: "Poi qdded" });
});
mongoose.connect(
  `mongodb://mongodb://${MONGO_URL}/${MONGO_DATABASE}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
     user: MONGO_USERNAME,
     password: MONGO_PASSWORD
    }
   }
  ).then(
    async () => {
      app.listen(3000);
    }
  );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected to Mongo!");
});
