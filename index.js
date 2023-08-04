const express = require("express");
const session = require("express-session");
const app = express();
const connectDB = require("./config/dbConfig");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const User = require("./model/userSchema");
const FoodModal = require("./model/foodSchema")
;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "foodSave",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1800000, // 30 minutes in milliseconds
    },
  })
);
// Serve uploaded images from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

const port = 5000;
connectDB();

app.get("/", (req, res) => {
  res.send("Everything is working fine...");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All perameters required...");
  }
  const user = await User.findOne({ email });
  if (user) {
    isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      req.session.user = {
        email: email,
      };
      res.status(200).send("logged in successfully...");
    }
  } else {
    res.status(401);
    throw new Error("Email or password is not valid...");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All perameters required...");
  }
  const userAvailble = await User.findOne({ email });
  if (userAvailble) {
    res.status(400);
    throw new Error("User with same email already exists..");
  } else {
    // Hashed Password:
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("User created successfully...");
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      res.status(201).json({ _id: newUser.id, email: newUser.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid...");
    }
  }
});

// Set up multer storage and file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Destination folder for uploaded files
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // Use a unique filename for each uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/uploadFood", upload.single("image"), async (req, res) => {
  if (
    !req.file ||
    !req.body.expDate ||
    !req.body.address ||
    !req.body.foodName
  ) {
    res.status(400);
    throw new Error("All perameters required...");
  }
  try {
    const newFood = new FoodModal({
      // Save the image URL in the database
      image: req.file.filename,
      foodName: req.body.foodName,
      expDate: req.body.expDate,
      address: req.body.address,
    });
    await newFood.save();
    res.status(201).json({ message: "Data uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload data." });
  }
});

app.get("/fetchFood", async (req, res) => {
  try {
    const availbleFoodList = await FoodModal.find();
    if (availbleFoodList) {
      res.send(availbleFoodList);
    } else {
      res.status(500).send("No food is availble...");
      throw new Error("No food is availble...");
    }
  } catch (err) {
    console.log("Error occured: ", err);
    res.status(500).send("Internal error");
  }
});

app.post("/logout", (req, res) => {
  // Destroy the session and remove user data
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
  });
  res.send("User logged out successfully...");
});

app.listen(port, () => console.log(`Listehning on port ${port}`));
