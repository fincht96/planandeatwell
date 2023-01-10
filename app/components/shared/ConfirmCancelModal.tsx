import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

const ConfirmCancelModal = ({
  isOpen,
  onClose,
  size = 'md',
  headerText,
  confirmColorScheme,
  handleConfirmClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  size?: string;
  headerText: string;
  confirmColorScheme: string;
  handleConfirmClick: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <ModalContent p={'1rem 0'}>
        <ModalHeader as={Text} fontSize={'lg'} fontWeight={'400'}>
          {headerText}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justifyContent={'space-around'}>
            <Button
              width={'9.5rem'}
              colorScheme={confirmColorScheme}
              onClick={handleConfirmClick}
            >
              Confirm
            </Button>
            <Button width={'9.5rem'} onClick={onClose}>
              Cancel
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCancelModal;
