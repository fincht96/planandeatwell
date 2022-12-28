import {
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { stripHtml } from 'string-strip-html';
import WYSIWYGEditor from '../WYSIWYGEditor';

export default function InstructionsAddModal({
  stepBeingAdded,
  isOpen,
  onClose,
  onSubmit,
}: {
  stepBeingAdded: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void;
}) {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitAndCloseModal = (event: any) => {
    onSubmit(event);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent p={'2rem 0'}>
          <ModalHeader as={Text} fontSize={'2xl'} fontWeight={'400'}>
            Add instruction for step {stepBeingAdded}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmitAndCloseModal)}
              autoComplete="off"
            >
              <FormControl isInvalid={!!errors.richTextContent} mb={'2rem'}>
                <Controller
                  defaultValue={''}
                  name={'richTextContent'}
                  control={control}
                  rules={{
                    validate: {
                      required: (v) =>
                        (v && stripHtml(v).result.length > 0) ||
                        'Description is required',
                      maxLength: (v) =>
                        (v && stripHtml(v).result.length <= 1000) ||
                        'Maximum character limit is 1000',
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <WYSIWYGEditor
                        onChange={field.onChange}
                        error={!!errors.richTextContent}
                        test={onClose}
                      />
                    );
                  }}
                />
                <Button type="submit" colorScheme={'brandSecondary'} mt={2}>
                  Add step
                </Button>
                <FormErrorMessage>
                  {errors.richTextContent &&
                    `${errors?.richTextContent.message}`}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
