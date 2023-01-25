import {
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { SlCheck, SlClose, SlPencil } from 'react-icons/sl';

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
      <Flex
        borderRadius="lg"
        height="3rem"
        width={isEditing ? 'auto' : '12rem'}
        align="center"
        justifyContent="center"
        bg="brand.500"
        cursor={isEditing ? 'none' : 'pointer'}
        onClick={isEditing ? () => null : () => setIsEditing(true)}
        _hover={{
          bg: isEditing ? 'brand.500' : 'brand.400',
        }}
      >
        {enableEditing && (
          <>
            {isEditing ? (
              <Flex>
                <form
                  onSubmit={(e) => handleSubmit(e, () => setIsEditing(false))}
                  autoComplete="off"
                >
                  <FormControl isInvalid={error.isError}>
                    <Flex alignItems={'center'}>
                      <Input
                        ref={ref}
                        onChange={onChange}
                        name={name}
                        bg="white"
                        px={2}
                        ml={2}
                        width="150px"
                      />
                      <ButtonGroup>
                        <IconButton
                          icon={<SlCheck fontSize="1.1rem" color="white" />}
                          type="submit"
                          aria-label="submit-button"
                          bg="none"
                        />
                        <IconButton
                          icon={<SlClose fontSize="1.1rem" color="white" />}
                          onClick={() => {
                            resetForm();
                            setIsEditing(false);
                          }}
                          aria-label="cancel-button"
                          bg="none"
                        />
                      </ButtonGroup>
                    </Flex>

                    <FormErrorMessage>
                      {error.isError && `${error?.message}`}
                    </FormErrorMessage>
                  </FormControl>
                </form>
              </Flex>
            ) : (
              <Flex>
                <Icon as={SlPencil} fontSize="1.1rem" color="white" />
                <Text
                  fontSize="md"
                  fontWeight={600}
                  textAlign="center"
                  noOfLines={1}
                  px={2}
                  color="white"
                >
                  {previewValue}
                </Text>
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
