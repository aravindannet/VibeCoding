import React, { useState, useEffect } from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  TextField,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Task, TaskComment, ReasonCode } from '../utils/types';

const ITEMS_PER_PAGE = 8; // 2 rows × 4 items

const REASON_CODES: ReasonCode[] = [
  // High Value Item
  { id: 1, code: 'HV1', description: 'High Value Change', isHighValue: true },
  // Non-High Value Items
  { id: 2, code: 'NV1', description: 'Documentation Updated', isHighValue: false },
  { id: 3, code: 'NV2', description: 'Unit Tests Added', isHighValue: false },
  { id: 4, code: 'NV3', description: 'Integration Tests Complete', isHighValue: false },
  { id: 5, code: 'NV4', description: 'Code Review Complete', isHighValue: false },
  { id: 6, code: 'NV5', description: 'Performance Testing Done', isHighValue: false },
  { id: 7, code: 'NV6', description: 'Security Review Complete', isHighValue: false },
  { id: 8, code: 'NV7', description: 'UI/UX Review Done', isHighValue: false },
  { id: 9, code: 'NV8', description: 'Accessibility Tested', isHighValue: false },
  { id: 10, code: 'NV9', description: 'Cross-browser Testing Complete', isHighValue: false },
  { id: 11, code: 'NV10', description: 'Mobile Responsiveness Verified', isHighValue: false },
  { id: 12, code: 'NV11', description: 'Error Handling Implemented', isHighValue: false },
  { id: 13, code: 'NV12', description: 'Logging Added', isHighValue: false },
  { id: 14, code: 'NV13', description: 'API Documentation Updated', isHighValue: false },
  { id: 15, code: 'NV14', description: 'Database Changes Reviewed', isHighValue: false },
  { id: 16, code: 'NV15', description: 'Data Migration Tested', isHighValue: false },
  { id: 17, code: 'NV16', description: 'Deployment Plan Ready', isHighValue: false },
  { id: 18, code: 'NV17', description: 'Rollback Plan Prepared', isHighValue: false },
  { id: 19, code: 'NV18', description: 'Configuration Updated', isHighValue: false },
  { id: 20, code: 'NV19', description: 'Dependencies Updated', isHighValue: false },
  { id: 21, code: 'NV20', description: 'Code Cleanup Complete', isHighValue: false },
  { id: 22, code: 'NV21', description: 'Technical Debt Addressed', isHighValue: false },
  { id: 23, code: 'NV22', description: 'Load Testing Complete', isHighValue: false },
  { id: 24, code: 'NV23', description: 'Monitoring Setup', isHighValue: false },
  { id: 25, code: 'NV24', description: 'Metrics Implementation Done', isHighValue: false },
  { id: 26, code: 'NV25', description: 'Release Notes Prepared', isHighValue: false },
];

interface Props {
  open: boolean;
  onClose: () => void;
  task: Task;
  onApprove: (taskId: string, reasonCodes: number[], comment: string, requiresReview: boolean) => void;
}

const TaskApprovalDialog: React.FC<Props> = ({ open, onClose, task, onApprove }) => {
  const [selectedReasons, setSelectedReasons] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [page, setPage] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [showAllCommentsModal, setShowAllCommentsModal] = useState(false);
  
  // Load existing comments when dialog opens
  React.useEffect(() => {
    if (open && task) {
      // For now, we'll simulate loading comments from localStorage or props
      // In a real app, this would fetch from an API
      const savedComments = localStorage.getItem(`task-comments-${task.id}`);
      if (savedComments) {
        try {
          const parsedComments = JSON.parse(savedComments);
          // Convert timestamp strings back to Date objects
          const commentsWithDates = parsedComments.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp)
          }));
          setComments(commentsWithDates);
        } catch (error) {
          console.error('Error parsing saved comments:', error);
          setComments([]);
        }
      } else {
        setComments([]);
      }
    }
  }, [open, task]);
  
  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedReasons([]);
      setComment('');
      setPage(1);
    }
  }, [open]);
  
  const standardReasons = REASON_CODES.filter(reason => !reason.isHighValue);
  const totalPages = Math.ceil(standardReasons.length / ITEMS_PER_PAGE);
  const currentPageReasons = standardReasons.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasHighValueReason = selectedReasons.some(
    (reasonId) => REASON_CODES.find((r) => r.id === reasonId)?.isHighValue
  );

  const handleApprove = () => {
    // Add comment to history if there's a new comment
    if (comment.trim()) {
      const newCommentEntry: TaskComment = {
        id: Date.now().toString(),
        taskId: task.id,
        comment: comment.trim(),
        user: 'Current User',
        timestamp: new Date()
      };
      
      const updatedComments = [...comments, newCommentEntry];
      setComments(updatedComments);
      
      // Save to localStorage (serialize dates as ISO strings)
      const storageKey = `task-comments-${task.id}`;
      const serializedComments = updatedComments.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }));
      localStorage.setItem(storageKey, JSON.stringify(serializedComments));
    }
    
    onApprove(task.id, selectedReasons, comment, hasHighValueReason);
    setSelectedReasons([]);
    setComment('');
    onClose();
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newCommentEntry: TaskComment = {
        id: Date.now().toString(),
        taskId: task.id,
        comment: comment.trim(),
        user: 'Current User',
        timestamp: new Date()
      };
      
      const updatedComments = [...comments, newCommentEntry];
      setComments(updatedComments);
      
      // Save to localStorage (serialize dates as ISO strings)
      const storageKey = `task-comments-${task.id}`;
      const serializedComments = updatedComments.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }));
      localStorage.setItem(storageKey, JSON.stringify(serializedComments));
      
      // Clear the comment input
      setComment('');
    }
  };

  const toggleReason = (reasonId: number) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonId)
        ? prev.filter((id) => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  return (
    <>
      <MuiDialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            background: '#fefefe',
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
      <DialogTitle sx={{ p: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Unblock Events
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ 
        p: 2.5, 
        pt: 1.5,
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Task Info - Increased Spacing */}
        <Box sx={{ mb: 1.5, pb: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, fontSize: '0.85rem', mb: 0.5 }}>
            {task.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Owner:</Typography>
            <Chip 
              label={task.owner || 'Unassigned'} 
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.55rem', height: 14 }}
            />
          </Box>
        </Box>

        {/* Main Content - Properly Constrained */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* High Value Items - Grid Layout Like Standard Items */}
          <Box sx={{ mb: 1.5, flexShrink: 0 }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.7rem', mb: 0.75 }}>
              High Value Items
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0.75,
              mb: 0.75
            }}>
              {REASON_CODES.filter(reason => reason.isHighValue).map((reason) => (
                <Paper
                  key={reason.id}
                  variant="outlined"
                  onClick={() => toggleReason(reason.id)}
                  sx={{
                    p: 1.25,
                    cursor: 'pointer',
                    borderColor: selectedReasons.includes(reason.id) ? '#2E3B8F' : 'divider',
                    bgcolor: selectedReasons.includes(reason.id) ? '#2E3B8F' : 'white',
                    transition: 'all 0.15s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                      borderColor: '#2E3B8F',
                      bgcolor: selectedReasons.includes(reason.id) ? '#2E3B8F' : '#E8E9F7',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: 70,
                    minHeight: 70
                  }}
                >
                  <Chip 
                    label={reason.code}
                    size="small"
                    sx={{ 
                      fontSize: '0.7rem', 
                      height: 16, 
                      mb: 0.75,
                      bgcolor: selectedReasons.includes(reason.id) ? '#FFFFFF' : 'transparent',
                      color: selectedReasons.includes(reason.id) ? '#2E3B8F' : '#2E3B8F',
                      border: selectedReasons.includes(reason.id) ? '1px solid #FFFFFF' : '1px solid #2E3B8F',
                      fontWeight: selectedReasons.includes(reason.id) ? 600 : 500
                    }}
                  />
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.75rem', 
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontWeight: selectedReasons.includes(reason.id) ? 700 : 500,
                    color: selectedReasons.includes(reason.id) ? '#FFFFFF' : 'inherit',
                    textShadow: selectedReasons.includes(reason.id) ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {reason.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Standard Items Header with Pagination - Increased Spacing */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75, flexShrink: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
              Standard Items
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Chip
                  key={pageNum}
                  label={pageNum}
                  onClick={() => setPage(pageNum)}
                  variant={page === pageNum ? "filled" : "outlined"}
                  color="primary"
                  size="small"
                  sx={{ 
                    minWidth: 18,
                    height: 16,
                    fontSize: '0.5rem',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* Standard Items Grid - 2 Rows */}
          <Box sx={{ 
            flex: 1,
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 0.75,
            mb: 1,
            height: 'auto',
            maxHeight: 120,
            minHeight: 0
          }}>
            {currentPageReasons.map((reason) => (
              <Paper
                key={reason.id}
                variant="outlined"
                onClick={() => toggleReason(reason.id)}
                sx={{
                  p: 1.25,
                  cursor: 'pointer',
                  borderColor: selectedReasons.includes(reason.id) ? 'primary.main' : 'divider',
                  bgcolor: selectedReasons.includes(reason.id) ? 'primary.lighter' : 'white',
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.lighter',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  height: 55
                }}
              >
                <Chip 
                  label={reason.code}
                  size="small"
                  color="primary"
                  variant={selectedReasons.includes(reason.id) ? "filled" : "outlined"}
                  sx={{ fontSize: '0.7rem', height: 16, mb: 0.75 }}
                />
                <Typography variant="caption" sx={{ 
                  fontSize: '0.75rem', 
                  lineHeight: 1.1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontWeight: 500
                }}>
                  {reason.description}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Bottom Section - Unified Look */}
          <Box sx={{ flexShrink: 0, minHeight: 0, mt: 0.5 }}>
            {/* Selection Summary with Latest Comment */}
            <Box sx={{ 
              mb: 2, 
              pb: 1, 
              pt: 1.5
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${selectedReasons.length} selected`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: '0.6rem', height: 20, fontWeight: 600 }}
                />
                {comments.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
                      Latest:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
                      <Chip 
                        label={comments[comments.length - 1].user}
                        size="small"
                        variant={comments[comments.length - 1].user === 'Current User' ? "outlined" : "outlined"}
                        color={comments[comments.length - 1].user === 'Current User' ? "primary" : "default"}
                        sx={{ fontSize: '0.75rem', height: 18, flexShrink: 0 }}
                      />
                      <Box 
                        sx={{ 
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.85rem', 
                            color: 'text.primary',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            animation: comments[comments.length - 1].comment.length > 50 ? 'marqueeDisappear 60s ease-in-out infinite' : 'none',
                            '@keyframes marqueeDisappear': {
                              '0%': { transform: 'translateX(0%)', opacity: 1 },
                              '40%': { transform: 'translateX(-100%)', opacity: 1 },
                              '42%': { transform: 'translateX(-100%)', opacity: 0 },
                              '45%': { transform: 'translateX(0%)', opacity: 0 },
                              '47%': { transform: 'translateX(0%)', opacity: 1 },
                              '87%': { transform: 'translateX(-100%)', opacity: 1 },
                              '89%': { transform: 'translateX(-100%)', opacity: 0 },
                              '92%': { transform: 'translateX(0%)', opacity: 0 },
                              '94%': { transform: 'translateX(0%)', opacity: 1 },
                              '100%': { transform: 'translateX(0%)', opacity: 1 }
                            }
                          }}
                        >
                          {comments[comments.length - 1].comment}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Inline Comment Section - Compact */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 1, mt: 2 }}>
              <TextField
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment..."
                variant="outlined"
                size="small"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    fontSize: '0.75rem',
                    height: 36
                  }
                }}
              />
              <MuiButton
                onClick={handleAddComment}
                disabled={!comment.trim()}
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 0, minWidth: 'auto', px: 2, height: 36, fontSize: '0.8rem' }}
              >
                Add
              </MuiButton>
            </Box>

            {/* Comment History - Compact */}
            {comments.length > 0 && (
              <Box sx={{ 
                maxHeight: 120, 
                overflowY: 'auto',
                border: '1px solid #e5e7eb',
                borderRadius: 0,
                p: 0.75,
                bgcolor: '#fafafa',
                mt: 1
              }}>
                <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', mb: 0.75, display: 'block' }}>
                  Comments ({comments.length})
                </Typography>
                <Stack spacing={1}>
                  {[...comments].reverse().slice(0, 6).map((commentItem) => (
                    <Box key={commentItem.id} sx={{ fontSize: '0.85rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip 
                          label={commentItem.user}
                          size="small"
                          variant={commentItem.user === 'Current User' ? "outlined" : "outlined"}
                          color={commentItem.user === 'Current User' ? "primary" : "default"}
                          sx={{ fontSize: '0.75rem', height: 18 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {new Date(commentItem.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.25 }}>
                        {commentItem.comment}
                      </Typography>
                    </Box>
                  ))}
                  {comments.length > 6 && (
                    <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.8rem', cursor: 'pointer' }}
                      onClick={() => setShowAllCommentsModal(true)}
                    >
                      +{comments.length - 6} more comments
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 1.5, gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
          <MuiButton 
            onClick={onClose} 
            variant="outlined" 
            color="inherit"
            size="medium"
            sx={{ borderRadius: 0, fontSize: '0.8rem', height: 40, px: 3 }}
          >
            Cancel
          </MuiButton>
          {comments.length > 6 && (
            <MuiButton
              onClick={() => setShowAllCommentsModal(true)}
              variant="text"
              size="medium"
              sx={{ borderRadius: 0, fontSize: '0.75rem', height: 40, px: 2 }}
            >
              View All ({comments.length})
            </MuiButton>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MuiButton
            onClick={handleApprove}
            disabled={selectedReasons.length === 0}
            variant="contained"
            color="primary"
            size="medium"
            sx={{ 
              borderRadius: 0,
              fontWeight: 600,
              boxShadow: 'none',
              fontSize: '0.8rem',
              height: 40,
              px: 3,
              '&:hover': {
                boxShadow: 2,
              }
            }}
          >
            {hasHighValueReason ? 'Submit for Review' : 'Approve'}
          </MuiButton>
        </Box>
      </DialogActions>
      </MuiDialog>
      
      {/* All Comments Modal */}
      <MuiDialog
      open={showAllCommentsModal}
      onClose={() => setShowAllCommentsModal(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          background: '#fefefe',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            All Comments for "{task.name}"
          </Typography>
          <IconButton onClick={() => setShowAllCommentsModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        {comments.length > 0 ? (
          <Stack spacing={2}>
            {comments.map((commentItem) => (
              <Paper 
                key={commentItem.id}
                variant="outlined" 
                sx={{ p: 2, borderRadius: 0, bgcolor: '#fafafa' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={commentItem.user}
                    size="small"
                    variant="filled"
                    color="primary"
                    sx={{ fontSize: '0.8rem' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {new Date(commentItem.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {commentItem.comment}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No comments yet
          </Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <MuiButton 
          onClick={() => setShowAllCommentsModal(false)}
          variant="contained"
          color="primary"
          size="medium"
          sx={{ borderRadius: 0, fontSize: '0.8rem', height: 40, px: 3 }}
        >
          Close
        </MuiButton>
      </DialogActions>
      </MuiDialog>
    </>
  );
};

export default TaskApprovalDialog;
