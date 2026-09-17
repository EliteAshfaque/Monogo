const express = require('express');
const notesModel  = require('./db/model/notes.model')
const app = express();
app.use(express.json())

app.post("/notes",async(req,res)=>{
    const data = req.body
  await  notesModel.create({
        title:data.title,  
        description:data.description
    })
    res.status(201).json({
        message:"Notes created sucessully"
    })
    
 
})
app.get("/notes",async(req,res)=>{
  try{
    const notes = await notesModel.find();
    res.json(notes)
  }catch(error){
    console.log("Error while getting the data")
  }
    
 
})

// Replace the complete note.
app.put("/notes/:id", async (req, res) => {
  try {
    const note = await notesModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(400).json({ message: "Unable to update note" });
  }
});

// Update only the fields provided, for example just title or description.
app.patch("/notes/:id", async (req, res) => {
  try {
    const note = await notesModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(400).json({ message: "Unable to update note" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await notesModel.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Unable to delete note" });
  }
});

module.exports = app
