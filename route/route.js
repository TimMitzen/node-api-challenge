const express = require("express");

const projects = require("../data/helpers/projectModel");
const actions = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await actions.get();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

router.get("/:id", validateById, async (req, res, next) => {
  try {
    const action = await actions.get(req.params.id);
    res.status(200).json(action);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/", validateBody, (req, res, next) => {
  // try{
  //    const action = await actions.insert(req.body);
  //    res.status(201).json(action)
  // }
  // catch(error){

  console.log(req.body);
  actions
    .insert(req.body)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ errorMessage: "Error" });
    });
});

router.put("/:id", validateBody, validateById, (req, res) => {
  actions
    .update(req.params.id, req.body)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ errorMessage: "error" });
    });
});

router.delete("/:id", (req, res) => {
  actions
    .remove(req.params.id)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ errorMessage: "Error" });
    });
});

function validateBody(req, res, next) {
  console.log(req.body);
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(500).json({ errorMessage: "Body is missing" });
  } else {
    next();
  }
}
function validateById(req, res, next) {
  if (req.params.id) {
    next();
  } else {
    res.status(404).json({ errorMessage: "No ID" });
  }
}

module.exports = router;
