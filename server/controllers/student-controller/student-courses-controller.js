const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student record exists
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    // If no courses are found for this student
    if (!studentBoughtCourses) {
      return res.status(404).json({
        success: false,
        message: "Student not found or no courses purchased",
      });
    }

    // If courses are found, return them
    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching courses",
    });
  }
};

module.exports = { getCoursesByStudentId };
