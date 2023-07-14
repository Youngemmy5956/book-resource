 import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    image: {type: String, required: true},
    pages:{ type: String, required: true },
    price:{ type: Number, required: true },
    author:{ type: String, required: true },


});

const Book_model = mongoose.model("Books", bookSchema);

export default Book_model;

// export default mongoose.model("Books", bookSchema);