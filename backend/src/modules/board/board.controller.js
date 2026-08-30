const boardService = require("./board.service");


// GET /api/board/workspace/:workspaceId
const getBoards = (req, res) => {
  try {
    const { workspaceId } = req.params;

    const boards = boardService.getBoardsByWorkspace(workspaceId);

    res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve boards",
      error: error.message,
    });
  }
};


// GET /api/board/:boardId
const getBoard = (req, res) => {
  try {
    const { boardId } = req.params;

    const board = boardService.getBoardById(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve board",
      error: error.message,
    });
  }
};


// POST /api/board/workspace/:workspaceId
const createBoard = (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Board name is required",
      });
    }

    const board = boardService.createBoard(workspaceId, req.body);

    res.status(201).json({
      success: true,
      data: board,
      message: "Board created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create board",
      error: error.message,
    });
  }
};


// PUT /api/board/:boardId
const updateBoard = (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Board name is required",
      });
    }

    const board = boardService.updateBoard(boardId, req.body);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
      message: "Board updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update board",
      error: error.message,
    });
  }
};


// DELETE /api/board/:boardId
const deleteBoard = (req, res) => {
  try {
    const { boardId } = req.params;

    const board = boardService.deleteBoard(boardId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
      message: "Board deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete board",
      error: error.message,
    });
  }
};


// GET /api/board/:boardId/members
const getBoardMembers = (req, res) => {
  try {
    const { boardId } = req.params;

    const members = boardService.getBoardMembers(boardId);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve board members",
      error: error.message,
    });
  }
};


// GET /api/board/:boardId/addable-members?workspaceId=w1
const getAddableMembers = (req, res) => {
  try {
    const { boardId } = req.params;
    const { workspaceId } = req.query;

    const members = boardService.getAddableMembers(boardId, workspaceId);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve addable members",
      error: error.message,
    });
  }
};


// POST /api/board/:boardId/members
const addBoardMember = (req, res) => {
  try {
    const { boardId } = req.params;

    const members = boardService.addBoardMember(boardId, req.body);

    res.status(201).json({
      success: true,
      data: members,
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add board member",
      error: error.message,
    });
  }
};


// DELETE /api/board/:boardId/members/:memberId
const removeBoardMember = (req, res) => {
  try {
    const { boardId, memberId } = req.params;

    const members = boardService.removeBoardMember(boardId, memberId);

    res.status(200).json({
      success: true,
      data: members,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove board member",
      error: error.message,
    });
  }
};


// PATCH /api/board/:boardId/admin
const changeBoardAdmin = (req, res) => {
  try {
    const { boardId } = req.params;
    const { newAdminId } = req.body;

    if (!newAdminId) {
      return res.status(400).json({
        success: false,
        message: "newAdminId is required",
      });
    }

    const board = boardService.changeBoardAdmin(boardId, newAdminId);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    res.status(200).json({
      success: true,
      data: board,
      message: "Board admin changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change board admin",
      error: error.message,
    });
  }
};


module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardMembers,
  getAddableMembers,
  addBoardMember,
  removeBoardMember,
  changeBoardAdmin,
};