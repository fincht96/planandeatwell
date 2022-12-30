import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const CustomEditable = React.forwardRef<
  HTMLInputElement,
  { label: string } & ReturnType<any>
>(
  (
    {
      previewValue,
      handleSubmit,
      onChange,
      name,
      resetForm,
      error,
      enableEditing,
    }: {
      previewValue: string;
      handleSubmit: any;
      onChange: any;
      name: any;
      resetForm: any;
      error: any;
      enableEditing: false;
    },
    ref,
  ) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
      <Flex gap={'1rem'}>
        {!isEditing && (
          <Text fontSize={'1.4rem'} color="gray.dark" fontWeight={600}>
            {previewValue}
          </Text>
        )}

        {enableEditing && (
          <>
            {isEditing ? (
              <form
                onSubmit={(e) => handleSubmit(e, () => setIsEditing(false))}
                autoComplete="off"
                style={{ width: '100%' }}
              >
                <FormControl isInvalid={error.isError}>
                  <Flex alignItems={'center'} gap={'1rem'}>
                    <Input ref={ref} onChange={onChange} name={name} />

                    <ButtonGroup justifyContent="center" size="sm">
                      <IconButton
                        icon={<CheckIcon />}
                        type="submit"
                        aria-label="submit-button"
                      />
                      <IconButton
                        icon={<CloseIcon />}
                        onClick={() => {
                          resetForm();
                          setIsEditing(false);
                        }}
                        aria-label="cancel-button"
                      />
                    </ButtonGroup>
                  </Flex>

                  <FormErrorMessage>
                    {error.isError && `${error?.message}`}
                  </FormErrorMessage>
                </FormControl>
              </form>
            ) : (
              <Flex justifyContent="center">
                <IconButton
                  size="sm"
                  icon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  aria-label="edit-button"
                />
              </Flex>
            )}
          </>
        )}
      </Flex>
    );
  },
);

CustomEditable.displayName = 'CustomEditable';

export default CustomEditable;
