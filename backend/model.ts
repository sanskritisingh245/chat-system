const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    role:{type:String, enum: ["candidate", "agent", "supervisor", "admin"],required:true},
    supervisorId: {type: mongoose.Types.ObjectId, ref: "User", default: null}
})

const conversationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Types.ObjectId, required: true },
    agentId: { type: mongoose.Types.ObjectId, default: null },
    status: { type: String, enum: ["open", "assigned", "closed"], default: "open" },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const messagesSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Types.ObjectId, required: true },
    senderId: { type: mongoose.Types.ObjectId, required: true },
    senderRole: { type: String, enum: ["agent", "candidate"] },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
const conversationModel = mongoose.model("Conversation", conversationSchema);
const messagesModel = mongoose.model("Message", messagesSchema);

module.exports = { userModel, conversationModel, messagesModel };
