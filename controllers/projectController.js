const {
  Project,
  validateComment,
  validateIssue,
  validateProject,
} = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { error } = validateProject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, description } = req.body;
    const user = req.user;

    await Project.create({
      author: user._id,
      name,
      description,
    });
    res.status(201).json({ message: "Created project" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project)
      return res.status(404).json({ message: "Cannot find project" });
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findById(id);
    if (!project)
      return res.status(400).json({ message: "Cannot find project" });
    project.name = name;
    project.description = description;
    await project.save();

    res.status(200).json({ message: "Updated project" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (project == null) {
      return res.status(404).json({ message: "Cannot find project" });
    }

    res.status(200).json({ message: "Deleted project" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const addCommentsOrIssues = async (req, res) => {
  try {
    const { project } = req;
    const { type } = req.params;
    type === "comments"
      ? (project.comments = [...project.comments, req.body])
      : (project.issues = [...project.issues, req.body]);
    await project.save();

    return res.status(200).json({ message: `Added ${type}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getCommentsOrIssues = async (req, res) => {
  try {
    const { project } = req;
    const { type } = req.params;
    return type === "comments"
      ? res.status(200).json({ comments: project.comments })
      : res.status(200).json({ issues: project.issues });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getCommentOrIssue = async (req, res) => {
  try {
    const { project } = req;
    const { type, id } = req.params;
    return type === "comments"
      ? res.status(200).json({
          comment: project.comments.find((comment) => comment._id == id),
        })
      : res
          .status(200)
          .json({ issue: project.issues.find((issue) => issue._id == id) });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateCommentOrIssue = async (req, res) => {
  try {
    const { project } = req;
    const { type, id } = req.params;
    type === "comments"
      ? (project.comments = [
          ...project.comments.map((comment) =>
            comment._id == id ? { ...comment, ...req.body } : { ...comment }
          ),
        ])
      : (project.issues = [
          ...project.comments.map((issue) =>
            issue._id == id ? { ...issue, ...req.body } : { ...issue }
          ),
        ]);
    await project.save();

    return res.status(200).json({ message: `Updated ${type}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteCommentOrIssue = async (req, res) => {
  try {
    const { project } = req;
    const { type, id } = req.params;
    type === "comments"
      ? (project.comments = [
          ...project.comments.filter((comment) => comment._id != id),
        ])
      : (project.issues = [
          ...project.comments.map((issue) => issue._id != id),
        ]);
    await project.save();

    return res.status(200).json({ message: `Deleted ${type}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addCommentsOrIssues,
  getCommentsOrIssues,
  getCommentOrIssue,
  updateCommentOrIssue,
  deleteCommentOrIssue,
};
