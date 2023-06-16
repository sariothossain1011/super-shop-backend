exports.ListService = async (req, DataModel) => {
  try {
    const data = await DataModel.find().select("-photo");
    const count = data.length; // Counting the number of items

    if (count === 0) {
      return { status: "fail", message: "Not found user category!" };
    } else {
      return { status: "success", count: count, data: data };
    }
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};
