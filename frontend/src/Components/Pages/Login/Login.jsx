//https://alexanderleon.medium.com/implement-social-authentication-with-react-restful-api-9b44f4714fa
//https://github.com/cuongdevjs/reactjs-social-login/tree/master
//https://gist.github.com/anonymous/6516521b1fb3b464534fbc30ea3573c2

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Navigate,   Link } from 'react-router-dom';
// import { onAuthStateChanged} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { EditIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import ButtonGoogleAuth from '../../Elements/ButtonGoogleAuth/ButtonGoogleAuth';
import ButtonMailAuth from '../../Elements/ButtonEmailAuth/ButtonMailAuth';
import { varNeoUser } from '../../../variables';
import {
  Container,
  Divider,
  Box,
  Stack,
  Button,
  Center,
} from '@chakra-ui/react';


const GET_USER_QUERY = gql`
  query GetUser($uid: String){
    users(where: { uid : $uid }) {
      uid
      name
      img
      city
      location{
        latitude
        longitude
      }
      cityID
      birthday
      gender
      privateProfile
      approved
      goodDeedTime
      embeddingCreationTime
      name
    }
  }
`;
// good

   
function Login(props) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const [redirect, setRedirect] = useState(false); 
  const [redirectTo, setRedirectTo] = useState('/profile'); 
  const [token, setToken] = useState(''); 
  const [googleUser, setGoogleUser] = useState('');
  const [loginError, setLoginError] = useState('');
  // const [user, setUser] = useState();
  
  const { currentUser, login, setError } = useAuth();
  
  const telegramWrapperRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const neoUser = useReactiveVar(varNeoUser);
  
  const {auth} = props;
  
  const { loading: gqlUserLoading, 
    error: gqlUserError, 
    data: gqlUserData, 
    refetch: gqlGetUser} = 
    useQuery(GET_USER_QUERY, 
    {
      variables: { uid: currentUser?.uid },
    });
    
  
  useEffect(() => {
    const scriptElement1 = document.createElement('script');
    scriptElement1.src = 'https://telegram.org/js/telegram-widget.js?22';
    scriptElement1.setAttribute('data-telegram-login', 'my100friends_bot');
    scriptElement1.setAttribute('data-size', 'large');
    scriptElement1.setAttribute('data-radius', '6');
    scriptElement1.setAttribute('data-onauth', 'onTelegramAuth(user)');
    scriptElement1.setAttribute('data-request-access', 'write');
    scriptElement1.async = true;
    
    var f = function onTelegramAuth(user) {

      window.tg_username = user.first_name
      localStorage.setItem("userData", JSON.stringify(user));
      
    }
    const scriptElement2 = document.createElement('script');
    scriptElement2.type = 'text/javascript'
    scriptElement2.innerHTML = f;

    telegramWrapperRef.current.appendChild(scriptElement1);
    telegramWrapperRef.current.appendChild(scriptElement2);
  }, []);
  
  
  useEffect(() => {

    if (currentUser){
      gqlGetUser({ variables: { uid: currentUser.uid }})
        .then((response) => {
          if (response.data.users.length){
            
            varNeoUser(response.data.users[0])
            
            if (!response.data.users[0].embeddingCreationTime){
              navigate("/dogood");
            } else if (!response.data.users[0].embeddingCreationTime){
              navigate("/words");
            } else {
              navigate("/profile"); // navigate("/");
            }
          } else {
            // user is in firebase, but is absent in neo4j
            navigate("/register");
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  }, [currentUser, navigate]);

  //! listener for local storage
  // useEffect(() => {
  //   function checkUserData() {
  //     const item = localStorage.getItem('userData')
  
  //     if (item) {
  //       setUserData(item)
  //     }
  //   }
  
  //   window.addEventListener('storage', checkUserData)
  
  //   return () => {
  //     window.removeEventListener('storage', checkUserData)
  //   }
  // }, [])
  
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // console.log("Name", user.getDisplayName())
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     // const uid = user.uid;
  //     // console.log("user", user)
  //     setGoogleUser(user)
      
  //     // ...
  //   } else {
  //     console.log("not user")
  //     //setUserAuthorized(false)
  //   }
  // });
  


  return (
    <Container maxW="3xl" marginTop="3rem" centerContent>

      <Container marginBlockStart={10} textAlign={'left'} maxW="2xl">
               
        <Box borderRadius="lg" padding={10} borderWidth="2px">
          
          <Stack spacing={5}>
            <Center>
              <div ref={telegramWrapperRef}></div>
            </Center>
            <Center >
              <ButtonGoogleAuth auth={auth} setUser={setGoogleUser} setToken={setToken} setError={setLoginError}/>
            </Center>
            <Center >
              <ButtonMailAuth auth={auth} mode="signin" />    
            </Center> 
            <Divider />
            <Center >
              <Link to="/register">
                <Button
                    size="sm"
                    leftIcon={<EditIcon/>}
                    colorScheme="green"
                    variant='link'
                    //onClick={SignIn}
                    //variant="solid"
                    //type="button"
                    // height='48px'
                    // width='200px'      
                    // fontSize='16px' 
                    //onClick={GoogleToggleSignIn}
                >  {t("register")}
                </Button>
              </Link>          
            </Center>
          </Stack>

        </Box>
      </Container>
    </Container>
  );
}

export default Login;