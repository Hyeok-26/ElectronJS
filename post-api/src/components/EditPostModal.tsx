import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Post } from '../../electron/types';


interface EditPostModalProps {
  show: boolean;
  onClose: () => void;
  post: Post | null;
  onUpdate: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ show, onClose, post, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // post가 바뀌면 form 값 초기화
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthor(post.author);
    }
  }, [post]);

  const handleSubmit = () => {
    if (title.trim() && author.trim() && post) {
      onUpdate({ id:post.id, title, author });
      onClose();
    } else {
      alert('제목과 작성자를 입력해주세요.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>게시물 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>작성자</Form.Label>
            <Form.Control
              type="text"
              placeholder="작성자 입력"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;