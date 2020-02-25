const express = require("express");

const projects = require("../data/helpers/projectModel");
const actions = require("../data/helpers/actionModel");

const router = express.Router();



// router.get("/", (req, res) => {
//   projects
//     .get()
//     .then(project => {
//       res.status(202).json(project);
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({ errorMessage: "no  projects" });
//     });
// });
router.get("/projects", async (req, res, next) => {
   try {
     const data = await projects.get();
     console.log(data)
     res.status(200).json(data);
   } catch (error) {
     console.log(error);
     res.status(404).json("Not found");
   }
 });

router.get("/:id", validateProjectId, (req, res) => {
  projects
    .get(req.params.id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "No project" });
    })
});

router.get("/:id/actions", validateProjectId, (req, res) => {
  projects
    .getProjectActions(req.params.id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "No Actions" })
    });
});

router.post("/",  (req, res) => {
  projects
    .insert(req.body)
    .then(project => {
      res.status(200).json({project,message: "project created"});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error" });
    });
});

router.put("/:id", validateProject, validateProjectId, (req, res) => {
  projects
    .update(req.params.id, req.body)
    .then(project => {
      res.status(200).json({project,message:'Updated post'});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "Not able to update project" });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  projects
    .remove(req.params.id)
    .then(project => {
      res.status(200).json(project,{message: "Deleted"});
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Not deletes project" });
    });
});

function validateProjectId(req, res, next) {
  if (req.params.id) {
    req.project = req.params.id;
    next();
  } else {
    res.status(400).json({ errorMessage: "No id" });
  }
}

function validateProject(req, res, next) {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({ errorMessage: 'No project name and description.' });
  } else {
    next();
  }
}

module.exports = router;
