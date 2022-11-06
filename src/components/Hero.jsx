import React from "react";

import {
  Stack,
  Heading,
  Button,
  Container,
  Image,
  Flex,
  Box,
  Link,
  useDisclosure,
  useToast,
  toast,
  Textarea,
  useClipboard,
  Text,
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputRightElement,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import Security from "../assets/security.svg";

const Hero = () => {
  const toast = useToast();

  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const [token, setToken] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  let [value, setValue] = React.useState("");
  const { onCopy, hasCopied } = useClipboard(value);
  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [image1,setImage1] = React.useState('');
  const [image2,setImage2] = React.useState('');
  const [image3,setImage3] = React.useState('');
  const [image4,setImage4] = React.useState('');
  let navigate = useNavigate();

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const savePassword = async () => {
    if (
      password != confirmpassword ||
      password.length == 0 ||
      confirmpassword.length == 0
    ) {
      toast({
        title: "Error!",
        description: "Password and Re-Enter pasword not matched",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // console.log(password)
      setRegisterLoading(true);
      let result = await fetch("http://localhost:3000/user/create", {
        method: "POST",
        body: JSON.stringify({
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      setRegisterLoading(false);
      let test = await result.json();
      if (test.success) {
        toast({
          title: "Success!",
          description: test.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onOpen2();

      } else {
        toast({
          title: "Eror!",
          description: test.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setValue(test.token);
      setToken(true);
      console.log("result", test);
    }
  };

  //vishnu's addition
  const imageFileUpload = (e, a) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      if(a==1){
        setImage1(reader.result);
      }else if(a==2){
        setImage2(reader.result);
      }
      else if(a==3){
        setImage3(reader.result);
      }else{
        setImage4(reader.result);
      }
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const submitImages = ()=>{
    fetch('http://localhost:3000/images/upload',{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "auth-token":value,
        "password":password
      },
      body:JSON.stringify({image1:window.btoa(image1),image2:window.btoa(image2),image3:window.btoa(image3),image4:window.btoa(image4)})
    }).then(response=>response.json()).then((data)=>{
      if(data.success){
        console.log(data);
        toast({
          title: "Success!",
          description: "Image order saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(()=>{
          location.reload();
        },1000);
      }else{
        toast({
          title: "Error!",
          description: "Image order already saved.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(()=>{
          location.reload();
        },1000);
        console.log(data);
      }
    })
  }
  return (
    <Container maxW="container.xl" bg="blue.50">
      <Stack direction={{ base: "column", md: "row" }} py={8}>
        <Flex flex="1">
          <Stack justifyContent="center" gap={8}>
            <Box maxW="50ch">
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                Secure, Decentralized Access to Your Data
              </Heading>
            </Box>
            <Stack direction="row" gap={8}>
              <Button colorScheme="blue" p={4} onClick={onOpen}>
                Sign Up
              </Button>
              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create your account</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <FormControl>
                      <FormLabel>Master Password</FormLabel>
                      <InputGroup size="md">
                        <Input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          pr="4.5rem"
                          type={show ? "text" : "password"}
                          placeholder="Enter password"
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel>Re-Enter Master Password</FormLabel>
                      <InputGroup size="md">
                        <Input
                          value={confirmpassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                          }}
                          pr="4.5rem"
                          type={show1 ? "text" : "password"}
                          placeholder="Re-Enter password"
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick1}>
                            {show1 ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={savePassword}
                      isLoading={registerLoading}
                      loadingText="Submitting"
                    >
                      Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen2}
                onClose={onClose2}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Choose Your Image Order</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <Text m={4} ml={0}><b>Choose Image 1</b></Text>
                    <Input isInvalid={!image1} p={1} type="file" mb={4} onChange={(e)=>{imageFileUpload(e,1)}}/>
                    <Box m={4}><img src={image1} title="image1" alt=""/></Box>
                    <Text m={4} ml={0}><b>Choose Image 2</b></Text>
                    <Input isInvalid={!image2} p={1} type="file" mb={4} onChange={(e)=>{imageFileUpload(e,2)}}/>
                    <Box m={4}><img src={image2} title="image1" alt=""/></Box>
                    <Text m={4} ml={0}><b>Choose Image 3</b></Text>
                    <Input isInvalid={!image3} p={1} type="file" mb={4} onChange={(e)=>{imageFileUpload(e,3)}}/>
                    <Box m={4}><img src={image3} title="image1" alt=""/></Box>
                    <Text m={4} ml={0}><b>Choose Image 4</b></Text>
                    <Input isInvalid={!image4} p={1} type="file" mb={4} onChange={(e)=>{imageFileUpload(e,4)}}/>
                    <Box m={4}><img src={image4} title="image1" alt=""/></Box>
                  {(!image1||!image2||!image3||!image4)&&<Text color="red">Please select four images **</Text>}
                  </ModalBody>
                  <ModalFooter>
                    
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={submitImages}
                      isLoading={registerLoading}
                      loadingText="Submitting"
                      disabled={!image1||!image2||!image3||!image4}
                    >
                      Submit
                    </Button>
                    <Button onClick={onClose2}>Cancel</Button>
                  </ModalFooter>
                  {token && (
                    <Box
                      value={value}
                      onChange={handleInputChange}
                      w="100%"
                      p="5"
                      color="black"
                      bg="blue.50"
                    >
                      <Text fontSize="xl">
                        Please Keep this Encrypted Key Safely!
                      </Text>
                      <br></br>
                      {value}
                      <br></br>
                      <Button
                        onClick={onCopy}
                        ml={2}
                        leftIcon={<CopyIcon />}
                        colorScheme="blue"
                      >
                        {hasCopied ? "Copied" : "Copy"}
                      </Button>
                    </Box>
                  )}
                </ModalContent>
              </Modal>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex="0.75" pt={{ base: 4, md: 0 }}>
          <Image src={Security} alt="Security" />
        </Flex>
      </Stack>
    </Container>
  );
};

export default Hero;
