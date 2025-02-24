const Cryptr = require("cryptr");
const cryptr = new Cryptr("DICT_Region_1_ILCDB");
const QRCode = require("qrcode");
const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const port = 3000;
const con = require("./db/connection");
const fs = require("fs");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const sharp = require("sharp");

// function certificateCode(fullname, courses, organization, venue, date) {
// return ${fullname}-${courses}-${organization}-${venue}-${date};
// }

// Session middleware
app.use(
  session({
    secret: "DICT_Region_1_ILCDB",
    resave: false,
    saveUninitialized: true,
  })
);

// Protect routes
const isLoggedIn = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect("/signin");
  }
  next();
};

// JSON
app.use(express.json());
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure QR directory exists
const qrDir = path.join(__dirname, "public/qrcodes");
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

app.get("/home", isLoggedIn, (req, res) => {
  sql = "SELECT * FROM courses";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    res.render("home", {
      errors: {},
      courses: result,
      certificate: ["", "", "", "", "", "", "", ""],
      hash_code: "",
      certificate_code: "",
      qr_image_path: "",
      id: null,
    });
  });
});

function encryptCertificateCode(data) {
  return cryptr.encrypt(data);
}

function decryptCertificateCode(encryptedData) {
  return cryptr.decrypt(encryptedData);
}

// Routes
app.get("/signin", (req, res) => {
  if (req.session.username) {
    return res.redirect("/home"); // If already logged in, redirect to home
  }
  res.render("signin", {
    success: null,
    admin: { username: "", password: "" },
    errors: {},
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const errors = {}; // Check if fields are empty

  if (!username || username.trim() === "")
    errors.username = "Admin username is required.";
  if (!password || password.trim() === "")
    errors.password = "Password is required.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("signin", {
      errors,
      success: null,
      admin: { username, password: "" }, // Keep username input
    });
  } // Step 1: Check if user exists with that username

  const checkUserSQL = `SELECT * FROM admin_user WHERE username = ?`;
  con.query(checkUserSQL, [username], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }

    if (result.length === 0 || result[0].password !== password) {
      // Secure approach: Do not indicate whether username or password is incorrect
      return res.status(401).render("signin", {
        errors: { general: "Invalid username or password." },
        success: null,
        admin: { username: "", password: "" }, // Clear input fields
      });
    } // If both username and password are correct, proceed to login

    console.log("User found:", result[0].username);
    req.session.username = result[0].username;
    return res.status(200).render("signin", {
      errors: null, // No errors
      success: "Login successfully!", // Success message
      admin: { username: "", password: "" }, // Clear input fields
    });
  });
});

app.get("/verify", async (req, res) => {
  const serial_number = req.query.code;

  if (!serial_number) {
    return res
      .status(400)
      .send("Invalid request. No certificate code provided.");
  }

  try {
    const [certificate] = await con
      .promise()
      .query("SELECT * FROM certificates WHERE serial_number = ?", [
        serial_number,
      ]);

    if (certificate === 0) {
      return res.render("verification", { certificate: null });
    }

    res.render("verification", { certificate: certificate[0] });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Server error");
  }
});

app.get("/view-all-generated", isLoggedIn, (req, res) => {
  sql = "SELECT * FROM certificates";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    res.render("view_all_generated", {
      generated_qr_codes: result,
    });
  });
});

app.delete("/delete_generated_qr_code/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  console.log("Received DELETE request for:", id); // Debugging

  const sql = "DELETE FROM certificates WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    console.log("Deletion successful, redirecting...");
    res.redirect("/view-all-generated");
  });
});

const QRGenerate = async (verification_url, certificate_code) => {
  try {
    console.log("Generating QR code for:", verification_url);
    const qr_image_filename = `${certificate_code}.png`;
    const qr_image_path = path.join(
      __dirname,
      "public",
      "qrcodes",
      qr_image_filename
    );
    const logo_path = path.join(__dirname, "public", "images", "logo.png");

    // Generate QR Code
    await QRCode.toFile(qr_image_path, verification_url, {
      width: 500,
      margin: 2,
    });

    // Overlay logo
    const qrBuffer = await sharp(qr_image_path).resize(250, 250).toBuffer();
    const logoBuffer = await sharp(logo_path).resize(100, 100).toBuffer();

    const finalImage = await sharp(qrBuffer)
      .composite([{ input: logoBuffer, gravity: "center" }])
      .toFile(qr_image_path);

    console.log("QR Code generated with logo:", qr_image_path);
    return qr_image_filename;
  } catch (err) {
    console.error("Error generating QR code with logo:", err);
    return null;
  }
};

app.post("/generate-qrcode", isLoggedIn, async (req, res) => {
  try {
    const {
      firstname,
      middlename,
      lastname,
      course,
      serial_number,
      organization,
      venue,
      date,
    } = req.body;
    const errors = {};

    if (!firstname || firstname.trim() === "")
      errors.firstname = "First name is required";
    if (!lastname || lastname.trim() === "")
      errors.lastname = "Last name is required";
    if (!serial_number || serial_number.trim() === "")
      errors.serial_number = "Serial number is required";
    if (!organization || organization.trim() === "")
      errors.organization = "Organization is required";
    if (!venue || venue.trim() === "") errors.venue = "Venue is required";
    if (!date || date.trim() === "") errors.date = "Date is required";

    const [courses] = await con.promise().query("SELECT * FROM courses");

    if (Object.keys(errors).length > 0) {
      return res.status(400).render("home", {
        errors,
        courses,
        hash_code: "",
        certificate: {
          firstname,
          lastname,
          courses,
          serial_number,
          organization,
          venue,
          date,
        },
        certificate_code: "",
        qr_image_path: "",
        id: null,
      });
    }

    const [existingSerialNumber] = await con
      .promise()
      .query("SELECT * FROM certificates WHERE serial_number = ?", [
        serial_number,
      ]);

    if (existingSerialNumber.length > 0) {
      errors.serial_number = "Serial number already exists";
      return res.render("home", {
        errors,
        courses,
        certificate: {
          firstname,
          middlename,
          lastname,
          course,
          serial_number,
          organization,
          venue,
          date,
        },
        hash_code: "",
        certificate_code: "",
        qr_image_path: "",
        id: null,
      });
    }

    //Format Date to Philippine Standard Time
    const formatted_date = new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    });
    // Proceed with QR Code Generation
    const certificate_code = `ILCDB_R1_${firstname}-${middlename}-${lastname}-${course}-${serial_number}-${organization}-${venue}-${formatted_date}`;
    const hash_code = encryptCertificateCode(certificate_code); // Generate a URL for verification
    const verification_url = `http://localhost:3000/verify?code=${encodeURIComponent(
      serial_number
    )}`;
    const qr_image_path = await QRGenerate(verification_url, certificate_code);

    await con
      .promise()
      .query(
        "INSERT INTO certificates (firstname, middlename, lastname, course, serial_number, organization, venue, date, certificate_code, hash_code, qr_image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          firstname,
          middlename,
          lastname,
          course,
          serial_number,
          organization,
          venue,
          date,
          certificate_code,
          hash_code,
          qr_image_path,
        ]
      );

    console.log("QR Code saved to database");
    res.render("home", {
      errors: {},
      courses,
      certificate: {
        firstname: "",
        middlename: "",
        lastname: "",
        course: "",
        serial_number: "",
        organization: "",
        venue: "",
        date: "",
      },
      hash_code,
      certificate_code,
      qr_image_path,
      id: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to generate QR code");
  }
});

app.get("/edit_generated_qr_code/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  console.log("Received GET request for:", id); // Debugging

  const sql = "SELECT * FROM certificates WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    if (result.length === 0) {
      console.error("Certificate not found:", id);
      return res.status(404).send("Certificate not found");
    }

    // Ensure the date is properly formatted
    if (result[0].date) {
      const dbDate = new Date(result[0].date);
      result[0].date = dbDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
    }

    const sql = "SELECT * FROM courses";
    con.query(sql, (err, courses) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Database error");
      }
      res.render("home", {
        errors: {},
        courses,
        hash_code: "",
        certificate: result[0],
        certificate_code: "",
        qr_image_path: "",
        id: id,
      });
    });
  });
});

app.put("/edit_generated_qr_code/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const {
    firstname,
    middlename,
    lastname,
    course,
    serial_number,
    organization,
    venue,
    date,
  } = req.body;

  try {
    const errors = {};

    if (!firstname || firstname.trim() === "")
      errors.firstname = "First name is required";
    if (!lastname || lastname.trim() === "")
      errors.lastname = "Last name is required";
    if (!serial_number || serial_number.trim() === "")
      errors.serial_number = "Serial number is required";
    if (!organization || organization.trim() === "")
      errors.organization = "Organization is required";
    if (!venue || venue.trim() === "") errors.venue = "Venue is required";
    if (!date || date.trim() === "") errors.date = "Date is required";

    // Fetch courses
    const [courses] = await con.promise().query("SELECT * FROM courses");

    if (Object.keys(errors).length > 0) {
      return res.status(400).render("home", {
        errors,
        courses, // Ensure courses is included in the response
        hash_code: "",
        certificate: {
          firstname,
          middlename,
          lastname,
          course,
          serial_number,
          organization,
          venue,
          date,
        },
        certificate_code: "",
        qr_image_path: "",
        id: id,
      });
    }

    const [existingSerialNumber] = await con
      .promise()
      .query("SELECT * FROM certificates WHERE serial_number = ?", [
        serial_number,
      ]);

    if (existingSerialNumber.length > 1) {
      errors.serial_number = "Serial number already exists";
      return res.render("home", {
        errors,
        courses,
        certificate: {
          firstname,
          middlename,
          lastname,
          course,
          serial_number,
          organization,
          venue,
          date,
        },
        hash_code: "",
        certificate_code: "",
        qr_image_path: "",
        id: id,
      });
    }

    //Format Date to Philippine Standard Time
    const formatted_date = new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    });

    // Proceed with QR Code Generation
    const certificate_code = `DICT_ILCDB_R1-${firstname}_${middlename}_${lastname}-${course}-${serial_number}-${organization}-${venue}-${formatted_date}`;
    const hash_code = encryptCertificateCode(certificate_code); // Generate a URL for verification
    const verification_url = `http://localhost:3000/verify?code=${encodeURIComponent(
      serial_number
    )}`;
    const qr_image_path = await QRGenerate(verification_url, certificate_code);

    // Update the certificate in the database
    await con
      .promise()
      .query(
        "UPDATE certificates SET firstname = ?, middlename = ?, lastname = ?, course = ?, serial_number = ?, organization = ?, venue = ?, date = ?, certificate_code = ?, hash_code = ?, qr_image_path = ? WHERE id = ?",
        [
          firstname,
          middlename,
          lastname,
          course,
          serial_number,
          organization,
          venue,
          date,
          certificate_code,
          hash_code,
          qr_image_path,
          id,
        ]
      );

    console.log("QR Code saved to database");
    res.render("home", {
      errors: {},
      courses,
      certificate: {
        firstname: "",
        middlename: "",
        lastname: "",
        course: "",
        serial_number: "",
        organization: "",
        venue: "",
        date: "",
      },
      hash_code,
      certificate_code,
      qr_image_path,
      id: id,
    });
  } catch (error) {
    console.error("Error updating certificate:", error);
    res.status(500).send("Failed to update certificate");
  }
});

app.post("/add-course", isLoggedIn, (req, res) => {
  const { course } = req.body;

  if (!course || course.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Course name is required." });
  }

  // Check if course already exists (case-insensitive)
  const checkCourseSQL = `SELECT * FROM courses WHERE LOWER(course) = LOWER(?)`;
  con.query(checkCourseSQL, [course], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    if (result.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Course already exists." });
    }
    // If the course doesn't exist, insert it
    const insertCourseSQL = `INSERT INTO courses (course) VALUES (?)`;
    con.query(insertCourseSQL, [course], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error." });
      }
      res.json({ success: true });
    });
  });
});

app.post("/update-course", isLoggedIn, (req, res) => {
  const { oldCourse, newCourse } = req.body;

  if (!oldCourse || !newCourse || newCourse.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Both old and new course names are required.",
    });
  }

  // Check if the new course name already exists (to avoid duplicates)
  const checkNewCourseSQL = `SELECT * FROM courses WHERE LOWER(course) = LOWER(?)`;
  con.query(checkNewCourseSQL, [newCourse], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    if (result.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "New course name already exists." });
    }

    // Update the course name
    const updateCourseSQL = `UPDATE courses SET course = ? WHERE LOWER(course) = LOWER(?)`;
    con.query(updateCourseSQL, [newCourse, oldCourse], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to update course." });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found." });
      }
      res.json({ success: true, message: "Course updated successfully!" });
    });
  });
});

app.post("/delete-course", isLoggedIn, (req, res) => {
  const { course } = req.body;

  if (!course) {
    return res
      .status(400)
      .json({ success: false, message: "Course name is required." });
  }

  const deleteCourseSQL = `DELETE FROM courses WHERE course = ?`;

  con.query(deleteCourseSQL, [course], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    res.json({ success: true });
  });
});

app.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.redirect("/signin");
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
