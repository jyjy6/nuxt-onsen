import BannerModel from "@/server/models/banners/BannerModel";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (event.method === "GET") {
    try {
      const banner = await BannerModel.findById(id);
      if (!banner) {
        return {
          status: 404,
          message: "Banner not found",
        };
      }
      return {
        status: 200,
        data: banner,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error fetching banner",
        error,
      };
    }
  } else if (event.method === "PUT") {
    try {
      const body = await readBody(event);
      const updatedBanner = await BannerModel.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true }
      );
      console.log(updatedBanner);

      if (!updatedBanner) {
        return {
          status: 404,
          message: "Banner not found",
        };
      }

      return {
        status: 200,
        data: updatedBanner,
        message: "Banner updated successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error updating banner",
        error,
      };
    }
  } else if (event.method === "DELETE") {
    try {
      const deletedBanner = await BannerModel.findByIdAndDelete(id);

      if (!deletedBanner) {
        return {
          status: 404,
          message: "Banner not found",
        };
      }

      return {
        status: 200,
        message: "Banner deleted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error deleting banner",
        error,
      };
    }
  }
});
