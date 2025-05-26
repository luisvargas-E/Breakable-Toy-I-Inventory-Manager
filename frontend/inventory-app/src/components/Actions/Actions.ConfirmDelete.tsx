import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try{
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to delete this product?</ModalHeader>
        <ModalBody>This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleConfirm} isLoading={isLoading} >
            Yes
          </Button>
          <Button variant="ghost" onClick={onClose} isLoading={isLoading}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;