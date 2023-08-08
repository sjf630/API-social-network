const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      // Respond with the thoughts
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a thought by its id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.id });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      // Respond with the found thought
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      // Add this thought to the user's list of thoughts
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      // Respond with the newly created thought
      res.status(200).json(thought);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },

  // Update a thought by its id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }

      // Respond with the updated thought
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought by its id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id });

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }

      // Remove this thought from the user's list of thoughts
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Thought deleted but no user found with this id!' });
      }

      // Respond with a message of successful deletion
      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }

      // Respond with the updated thought
      res.json(thought);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },

  // Remove a reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }

      // Respond with the updated thought
      res.json(thought);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
