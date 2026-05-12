import { prisma } from "../config/prisma.js";
// this is used in branch page for the modal to show specialization details on the basis of branch
export const specializationDetailsForBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Branch ID is required",
        success: false,
      });
    }
    const specializationDetails = await prisma.specialization.findMany({
      where: {
        branch_id: id, // ✅ correct field name
      },

      select: {
        id: true,
        name: true,
        code: true,
        is_active: true,

        _count: {
          select: {
            subjects: true, // ✅ proper syntax
            batches: true, // optional total batches count
          },
        },

        batches: {
          select: {
            id: true,
            label: true,

            _count: {
              select: {
                section: true, // ✅ count sections inside batch
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      data: specializationDetails,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
