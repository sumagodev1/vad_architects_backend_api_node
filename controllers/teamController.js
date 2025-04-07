const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Team = require('../models/Team');
const apiResponse = require('../helper/apiResponse');
const { validationResult } = require('express-validator');

// Add a new team member
// exports.addTeamMember = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
//   }

//   const transaction = await sequelize.transaction();
  
//   try {
//     const { name, designation, description, position_no } = req.body;
//     const img = req.file ? req.file.path : null;

//     // Increment positions of existing members
//     await Team.update(
//       { position_no: Sequelize.literal('position_no + 1') },
//       { 
//         where: { position_no: { [Sequelize.Op.gte]: position_no }, isDelete: false },
//         transaction
//       }
//     );

//     // Create the new team member
//     const teamMember = await Team.create({
//       img,
//       name,
//       designation,
//       description,
//       position_no,
//       isActive: true,
//       isDelete: false,
//     }, { transaction });

//     await transaction.commit();

//     return apiResponse.successResponseWithData(
//       res,
//       'Team member added successfully',
//       teamMember
//     );
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Add team member failed', error);
//     return apiResponse.ErrorResponse(res, 'Add team member failed');
//   }
// };

exports.addTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  const transaction = await sequelize.transaction();

  try {
    const { name, designation, description } = req.body;
    // , position_no
    const img = req.file ? req.file.path : null;

    // Check if the position_no already exists
    // const existingPosition = await Team.findOne({
    //   where: { position_no: position_no, isDelete: false }
    // });

    // if (existingPosition) {
    //   return apiResponse.ErrorResponse(res, 'Position no already exists, please enter another number');
    // }

    // Increment positions of existing members
    // await Team.update(
    //   { position_no: Sequelize.literal('position_no + 1') },
    //   { 
    //     where: { position_no: { [Sequelize.Op.gte]: position_no }, isDelete: false },
    //     transaction
    //   }
    // );

    // Create the new team member
    const teamMember = await Team.create({
      img,
      name,
      designation,
      description,
      
      isActive: true,
      isDelete: false,
    }, { transaction });
    // position_no,

    await transaction.commit();

    return apiResponse.successResponseWithData(
      res,
      'Team member added successfully',
      teamMember
    );
  } catch (error) {
    await transaction.rollback();
    console.error('Add team member failed', error);
    return apiResponse.ErrorResponse(res, 'Add team member failed');
  }
};




// Update an existing team member
// exports.updateTeamMember = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { name, designation, description, position_no } = req.body;
//     const img = req.file ? req.file.path : null;

//     // Find the team member
//     const teamMember = await Team.findByPk(id);
//     if (!teamMember) {
//       await transaction.rollback();
//       return apiResponse.notFoundResponse(res, 'Team member not found');
//     }

//     // Adjust positions only if the position_no has changed
//     if (teamMember.position_no !== position_no) {
//       if (position_no < teamMember.position_no) {
//         // Increment positions of records shifting down
//         await Team.update(
//           { position_no: Sequelize.literal('position_no + 1') },
//           {
//             where: {
//               position_no: {
//                 [Sequelize.Op.between]: [position_no, teamMember.position_no - 1],
//               },
//               isDelete: false,
//             },
//             transaction
//           }
//         );
//       } else {
//         // Decrement positions of records shifting up
//         await Team.update(
//           { position_no: Sequelize.literal('position_no - 1') },
//           {
//             where: {
//               position_no: {
//                 [Sequelize.Op.between]: [teamMember.position_no + 1, position_no],
//               },
//               isDelete: false,
//             },
//             transaction
//           }
//         );
//       }
//     }

//     // Update the team member
//     teamMember.img = img || teamMember.img;
//     teamMember.name = name;
//     teamMember.designation = designation;
//     teamMember.description = description;
//     teamMember.position_no = position_no;
//     await teamMember.save({ transaction });

//     await transaction.commit();

//     return apiResponse.successResponseWithData(
//       res,
//       'Team member updated successfully',
//       teamMember
//     );
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Update team member failed', error);
//     return apiResponse.ErrorResponse(res, 'Update team member failed');
//   }
// };

// below working

// exports.updateTeamMember = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
//   }

//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { name, designation, description, position_no } = req.body;
//     const img = req.file ? req.file.path : null;

//     // Find the team member to update
//     const teamMember = await Team.findByPk(id);
//     if (!teamMember) {
//       await transaction.rollback();
//       return apiResponse.notFoundResponse(res, 'Team member not found');
//     }

//     // 🔴 Check if the new position_no already exists for another team member
//     const positionExists = await Team.findOne({
//       where: {
//         position_no: position_no,
//         id: { [Sequelize.Op.ne]: id }, // Exclude the current team member
//         isDelete: false, // Ensure we're not looking at deleted records
//       },
//     });

//     if (positionExists) {
//       // If position_no already exists for another team member, return an error
//       await transaction.rollback(); // Rollback changes since nothing should be updated
//       return apiResponse.ErrorResponse(res, 'Position no already exists, please enter another number');
//     }

//     // Adjust positions only if the position_no has changed
//     if (teamMember.position_no !== position_no) {
//       if (position_no < teamMember.position_no) {
//         // Increment positions of records shifting down
//         await Team.update(
//           { position_no: Sequelize.literal('position_no + 1') },
//           {
//             where: {
//               position_no: {
//                 [Sequelize.Op.between]: [position_no, teamMember.position_no - 1],
//               },
//               isDelete: false,
//             },
//             transaction
//           }
//         );
//       } else {
//         // Decrement positions of records shifting up
//         await Team.update(
//           { position_no: Sequelize.literal('position_no - 1') },
//           {
//             where: {
//               position_no: {
//                 [Sequelize.Op.between]: [teamMember.position_no + 1, position_no],
//               },
//               isDelete: false,
//             },
//             transaction
//           }
//         );
//       }
//     }

//     // Update the team member
//     teamMember.img = img || teamMember.img;
//     teamMember.name = name;
//     teamMember.designation = designation;
//     teamMember.description = description;
//     teamMember.position_no = position_no;
//     await teamMember.save({ transaction });

//     await transaction.commit();

//     return apiResponse.successResponseWithData(
//       res,
//       'Team member updated successfully',
//       teamMember
//     );
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Update team member failed', error);
//     return apiResponse.ErrorResponse(res, 'Update team member failed');
//   }
// };

exports.updateTeamMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.ErrorResponse(res, errors.array().map(err => err.msg).join(', '));
  }

  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { name, designation, description } = req.body;
    const img = req.file ? req.file.path : null;

    // Find the team member to update
    const teamMember = await Team.findByPk(id);
    if (!teamMember) {
      await transaction.rollback();
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    // Update the team member (without position_no)
    teamMember.img = img || teamMember.img;
    teamMember.name = name;
    teamMember.designation = designation;
    teamMember.description = description;
    await teamMember.save({ transaction });

    await transaction.commit();

    return apiResponse.successResponseWithData(
      res,
      'Team member updated successfully',
      teamMember
    );
  } catch (error) {
    await transaction.rollback();
    console.error('Update team member failed', error);
    return apiResponse.ErrorResponse(res, 'Update team member failed');
  }
};



// Get all team members
exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.findAll({ 
      where: { isDelete: false },
      // order: [['position_no', 'ASC']] 
    });

    const baseUrl = `${process.env.SERVER_PATH}`;
        const teamMembersWithBaseUrl = teamMembers.map(member => ({
      ...member.toJSON(),
      img: member.img ? baseUrl + member.img.replace(/\\/g, '/') : null,
    }));

    return apiResponse.successResponseWithData(
      res,
      'Team members retrieved successfully',
      teamMembersWithBaseUrl
    );
  } catch (error) {
    console.error('Get team members failed', error);
    return apiResponse.ErrorResponse(res, 'Get team members failed');
  }
};

// Toggle the active status of a team member
exports.isActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();

    return apiResponse.successResponseWithData(
      res,
      'Team member active status updated successfully',
      teamMember
    );
  } catch (error) {
    console.error('Toggle team member active status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle team member active status failed');
  }
};

// Toggle the delete status of a team member
exports.isDeleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return apiResponse.notFoundResponse(res, 'Team member not found');
    }

    teamMember.isDelete = !teamMember.isDelete;
    await teamMember.save();

    return apiResponse.successResponseWithData(
      res,
      'Team member delete status updated successfully',
      teamMember
    );
  } catch (error) {
    console.error('Toggle team member delete status failed', error);
    return apiResponse.ErrorResponse(res, 'Toggle team member delete status failed');
  }
};
