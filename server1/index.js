//index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import UserModel from "./Models/Users.js";
import ArtModel from "./Models/Art.js";
import bcrypt from "bcrypt";

let app = express();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { remail, rpassword } = req.body;
    const User = await UserModel.findOne({ email: remail });
    if (!User) {
      return res.status(500).json({ msg: "User not found.." });
    } else {
      const passwordMatch = await bcrypt.compare(rpassword, User.password);
      if (passwordMatch)
        return res.status(200).json({ User, msg: "Success.." });
      else 
        return res.status(401).json({ msg: "Authentication Failed.." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const pic = req.body.pic;

    const hpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name: name,
      email: email,
      password: hpassword,
      pic: pic,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


// Add Art
app.post("/addArt", async (req, res) => {
  try {
    const { img, text, price, forSale, date } = req.body;
    if (!img || !text || !price || !forSale || !date) {
      return res.status(400).json({ error: "Image URL, text, price, forSale, and date are required." });
    }
    const art = new ArtModel({ img, text, price, forSale, date });
    await art.save();
    res.status(201).json({ art, msg: "Art added successfully." });
  } catch (error) {
    console.error("Add art error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Update Art
app.put("/updateArt/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { img, text, price, forSale, date } = req.body;
    const updatedArt = await ArtModel.findByIdAndUpdate(id, { img, text, price, forSale, date }, { new: true });
    if (!updatedArt) {
      return res.status(404).json({ error: "Art not found." });
    }
    res.status(200).json({ art: updatedArt, msg: "Art updated successfully." });
  } catch (error) {
    console.error("Update art error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Delete Art
app.delete("/deleteArt/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArt = await ArtModel.findByIdAndDelete(id);
    if (!deletedArt) {
      return res.status(404).json({ error: "Art not found." });
    }
    res.status(200).json({ id, msg: "Art deleted successfully." });
  } catch (error) {
    console.error("Delete art error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/arts", async (req, res) => {
  try {
    const arts = await ArtModel.find();
    res.status(200).json(arts);
  } catch (error) {
    console.error("Fetch arts error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


  var conn =
"mongodb+srv://admin:1234@cluster0.d8jtlxb.mongodb.net/ARTGallery?retryWrites=true&w=majority&appName=Cluster0";
  

mongoose.connect(conn);

app.listen(3002, () => {
  console.log("Server Connected..");
});
