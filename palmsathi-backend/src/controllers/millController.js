import Mill from "../models/Mill.js";

export async function createMill(req, res) {
  try {
    const mill = await Mill.create(req.body);
    res.status(201).json(mill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listMills(req, res) {
  const mills = await Mill.find();
  res.json(mills);
}

export async function getMillSlots(req, res) {
  const mill = await Mill.findById(req.params.id);
  if (!mill) return res.status(404).json({ error: "Mill not found" });
  res.json(mill.slots);
}
