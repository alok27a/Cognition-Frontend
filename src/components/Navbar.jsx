import React, { useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Button,
  Container,
  Heading,
  Link,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Input,
  InputGroup,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { NavLink, useNavigate } from "react-router-dom";
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
import logo from "../assets/cover.png";
const Links = ["Home"];
const LinkURLS = ["/", "/about", "/contact"];

const ExternalLinks = ["About", "Github"];
const ExternalLinkUrls = [
  "", //Devpost Link
  "https://github.com/alok27a/Cognition-Frontend", // Github link
];

const externalLink = ({ link, index }) => {
  return (
    <Link
      key={index}
      href={ExternalLinkUrls[index]}
      isExternal
      color="gray.500"
    >
      {link}
    </Link>
  );
};

const MyNavLink = ({ link, index }) => {
  return (
    <NavLink to={LinkURLS[index]}>
      {({ isActive }) => (
        <Link color={isActive ? "blue.500" : "gray.500"}>{link}</Link>
      )}
    </NavLink>
  );
};

const Navbar = () => {
  const toast = useToast();
  const [imageOrder, setImageOrder] = React.useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  let navigate = useNavigate();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [image1, setImage1] = React.useState("");
  const [image2, setImage2] = React.useState("");
  const [image3, setImage3] = React.useState("");
  const [image4, setImage4] = React.useState("");

  const [index1, setIndex1] = React.useState();
  const [index2, setIndex2] = React.useState();
  const [index3, setIndex3] = React.useState();
  const [index4, setIndex4] = React.useState();
  const [imageLoading,setImageLoading] = React.useState(false);
  const [imageSending,setImageSending] = React.useState(false);
  const [finalImageOrder, setFinalImageOrder] = React.useState([]);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  const signinClicked = async () => {
    if (password.length == 0 || token.length == 0) {
      toast({
        title: "Error!",
        description: "No value Entered",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      // console.log(password)
      setLoginLoading(true);
      let result = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        body: JSON.stringify({
          password: password,
          token: token,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      setLoginLoading(false);
      let test = await result.json();
      if (test.success) {
        console.log("result", test);
        sessionStorage.setItem("secretKey", test.token);
        sessionStorage.setItem("password", password);
        onOpen2();
        setImageLoading(true);
        fetch("http://localhost:3000/images/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("secretKey"),
            password: sessionStorage.getItem("password"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setImageLoading(false);
            if (data.success) {
              setImage1(window.atob(data.data.image1));
              setImage2(window.atob(data.data.image2));
              setImage3(window.atob(data.data.image3));
              setImage4(window.atob(data.data.image4));
            }
          });
      } else {
        toast({
          title: "Error!",
          description: "Incorrect Password or Secret Key",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const setIndex = (indexVal) => {
    const temp = [...finalImageOrder];
    console.log(finalImageOrder);
    if (finalImageOrder.includes(indexVal)) {
      temp.splice(temp.indexOf(indexVal), 1);
      setFinalImageOrder(temp);
    } else {
      temp.push(indexVal);
      setFinalImageOrder(temp);
    }
  };
  const imagesSend = () => {
    setImageSending(true);
    const temp = [image1, image2, image3, image4];
    console.log(finalImageOrder);
    console.log(temp);
    console.log(
      JSON.stringify({
        image1:temp[finalImageOrder[0]-1],
        image2: temp[finalImageOrder[1]-1],
        image3: temp[finalImageOrder[2]-1],
        image4: temp[finalImageOrder[3]-1],
      })
    );
    fetch("http://localhost:3000/images/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("secretKey"),
        "password": sessionStorage.getItem("password"),
      },
      body: JSON.stringify({
        image1: window.btoa(temp[finalImageOrder[0]-1]),
        image2: window.btoa(temp[finalImageOrder[1]-1]),
        image3: window.btoa(temp[finalImageOrder[2]-1]),
        image4: window.btoa(temp[finalImageOrder[3]-1]),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImageSending(false);
        if (data.success) {
          navigate("/dashboard");
        } else {
          toast({
            title: "Error!",
            description: "Image Order Does not Match",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };
  return (
    <Box px={4}>
      <Container maxW="container.xl" py={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            display={{ md: "none" }}
            aria-label={"Toggle menu"}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            justifyContent="space-between"
            w={{ base: "none", md: "full" }}
            mx={{ base: "auto", md: 0 }}
          >
            <HStack>
              <img src={logo} width="40%" />
            </HStack>
            <HStack spacing={8} display={{ base: "none", md: "flex" }}>
              {Links.map((link, index) => (
                <MyNavLink key={index + link} link={link} index={index} />
              ))}
              {ExternalLinks.map((link, index) =>
                externalLink({ link, index })
              )}
              <Button colorScheme="blue" p={4} onClick={onOpen}>
                Sign In
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
                          ref={initialRef}
                          placeholder="Enter Password Here"
                          type={show ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel> Enter Secret Key</FormLabel>
                      <Input
                        placeholder="Enter Here"
                        value={token}
                        onChange={(e) => {
                          setToken(e.target.value);
                        }}
                      />
                    </FormControl>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={signinClicked}
                      isLoading={loginLoading}
                      loadingText="Signing In"
                    >
                      Sign In
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
                size="xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Chose the correct image order</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody w="100%" pb={6}>
                    <Text>Order the images: </Text>
                    <Flex style={{ flexWrap: "wrap", flex: 1 }} gap={4}>
                      <Box  p={4}style={{ position: "relative" }}>
                        {imageLoading && <Spinner/>}
                        {!imageLoading && <img src={image1} onClick={() => setIndex("1")} />}
                        <Text style={{ position: "absolute" }}>
                          {finalImageOrder.indexOf("1") + 1}
                        </Text>
                      </Box>
                      <Box p={4}>
                      {imageLoading && <Spinner/>}
                        <img src={image2} onClick={() => setIndex("2")} />
                        <Text>{finalImageOrder.indexOf("2") + 1}</Text>
                      </Box>
                      <Box p={4}>
                      {imageLoading && <Spinner/>}
                        <img src={image3} onClick={() => setIndex("3")} />
                        <Text>{finalImageOrder.indexOf("3") + 1}</Text>
                      </Box>
                      <Box p={4}>
                      {imageLoading && <Spinner/>}
                        <img src={image4} onClick={() => setIndex("4")} />
                        <Text>{finalImageOrder.indexOf("4") + 1}</Text>
                      </Box>
                    </Flex>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={imagesSend}
                      isLoading={imageSending}
                      loadingText="Sending Images"
                    >
                      Submit Images
                    </Button>
                    <Button
                      mr={3}
                      onClick={() => {
                        setFinalImageOrder([]);
                      }}
                    >
                      Clear Order
                    </Button>
                    <Button onClick={onClose2}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
