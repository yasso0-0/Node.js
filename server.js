const express = require("express");
const mongoose = require("mongoose");

let app = express();

// connect the server to mongoDB
let connectDB = async function () {
  try {
    await mongoose.connect("mongodb://localhost:27017/TASK");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
  }
};
connectDB();

// Schema and Models
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  level: String,
  address: String,
});

const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
});

const Student = mongoose.model("users", studentSchema);
const Doctor = mongoose.model("doctors", doctorSchema);

app.post("/add-Doctor-hardcoded", async (req, res) => {
  try {
    const newDoctor = new Doctor({
      name: "DrName",
      age: 20,
      phone: "+201281772766"
    });

    await newDoctor.save();
    res.status(201).json("Hardcoded Doctor added");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Raneem's Part - Add Hardcoded Student
app.post("/add-student-hardcoded", async (req, res) => {
  try {
    const newStudent = new Student({
      name: "Ali",
      age: 20,
      level: "3rd",
      address: "Cairo",
    });

    await newStudent.save();
    res.status(201).json("Hardcoded student added");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doaa's Part - Add Student from Body
app.post("/add-student", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json("Student added from body");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Ahmed's Part - Add Doctor from Query
app.post("/add-doctor", async (req, res) => {
  try {
    const { name, age, phone } = req.query;
    const newDoctor = new Doctor({ name, age, phone });
    await newDoctor.save();
    res.status(201).json("Doctor added from query");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//Ehab's Part - Update
//http://localhost:3000/updateDoctor?oldname=Dr%20Smith&newname=Dr%20John

app.patch("/updateDoctor", async (req, res) => {
  const currentName = req.query.oldname?.trim();
  const updatedName = req.query.newname?.trim();

  const doctorToUpdate = await Doctor.findOne({ name: currentName });
  if (!doctorToUpdate) return res.status(404).json({ message: "Doctor not found" });

  const existingDoctor = await Doctor.findOne({ name: updatedName });
  if (existingDoctor) return res.status(400).json({ message: "This name is already used" });

  doctorToUpdate.name = updatedName;
  await doctorToUpdate.save();

  res.status(200).json({ message: "Doctor name updated successfully" });
});

//Badry's Part - Delete Student
app.delete('/students/:name', async (req, res) => {
  try {
    const studentName = req.params.name;
    const deletedStudent = await Student.findOneAndDelete({ name: studentName });

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
});

// Yasser's Part - Get Students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
});

// Yasser's Part - Get All Data
app.get("/all", async (req, res) => {
    const students = await Student.find();
    const doctors = await Doctor.find();
    res.status(200).json({ students, doctors });
  });

// Start Server
app.listen(3000, () => {
  console.log("Server connected");
});