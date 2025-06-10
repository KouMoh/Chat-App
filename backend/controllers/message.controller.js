import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"; // import Message model

export const sendMessage = async (req, res) => {
    try {

        const { id: receiverId } = req.params; // Extract the ID from the request parameters
        const { message } = req.body; // Extract the message from the request body
        const senderId = req.user._id; // Get the sender's ID from the authenticated user

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},
        });
        if (!conversation) {
            // If the conversation does not exist, create a new one
            conversation = new Conversation({
                participants: [senderId, receiverId],
            });
        }

        // Create and save the message document
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage) {
            // If the message is successfully created, add it to the conversation
            conversation.messages.push(newMessage._id);
        }
        // await newMessage.save();

        //ADD SOCKET IO

        // Push the message's ObjectId to the conversation
        // await conversation.save(); // Save the conversation with the new message
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({
            message: message,
        });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
