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

const CustomEditable = React.forwardRef(
  (
    {
      previewValue,
      handleSubmit,
      onChange,
      name,
      resetForm,
      error,
    }: {
      previewValue: string;
      handleSubmit: any;
      onChange: any;
      name: any;
      resetForm: any;
      error: any;
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
                  <IconButton icon={<CheckIcon />} type="submit" />
                  <IconButton
                    icon={<CloseIcon />}
                    onClick={() => {
                      resetForm();
                      setIsEditing(false);
                    }}
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
            />
          </Flex>
        )}
      </Flex>
    );
  },
);

export default CustomEditable;
