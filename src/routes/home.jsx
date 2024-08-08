import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const icecreamRef = doc(db, "icecream", "Mtu2EMz2fp8FKkItKQm5");

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Fail = styled.span`
  position: fixed;
  font-size: 3em;
  font-weight: 900;
  color: #222;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  padding: 12px 24px;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: all 0.1s linear;
  &.active {
    top: 24px;
    opacity: 1;
  }
`;

const Success = styled.span`
  position: fixed;
  font-size: 3em;
  font-weight: 900;
  color: #19dc57;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  padding: 12px 24px;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: all 0.1s linear;
  &.active {
    top: 24px;
    opacity: 1;
  }
`;
const Header = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
`;
const Logout = styled.button`
  font-size: 16px;
  color: #333;
  background-color: #fff;
  border-radius: 24px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #eee;
  &:hover {
    background-color: #eee;
  }
`;

const HeaderTithe = styled.h1`
  margin-top: 30px;
  font-size: 60px;
  font-weight: 900;
  color: #ff3636;
  letter-spacing: -2px;
`;

const RecipeWrapper = styled.div`
  width: 100%;
  max-width: 454px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 90px;
  .title {
    font-size: 14px;
    color: #333;
    font-weight: 900;
  }
  .object {
    padding-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    > div {
      width: 100%;
      max-width: 164px;
      aspect-ratio: 140 /83;
      &.one {
        z-index: 2;
      }
      &.two {
        transform: translateY(-50px);
        z-index: 1;
      }
      &.three {
        transform: translateY(-100px);
        z-index: 0;
      }
      &.strawberry {
        background: url(public/ico_icecream_strawberry.svg) no-repeat center /
          cover;
      }
      &.choco {
        background: url(public/ico_icecream_choco.svg) no-repeat center / cover;
      }
      &.mint {
        background: url(public/ico_icecream_mint.svg) no-repeat center / cover;
      }
    }
  }
`;
const Recipe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const MyRecipe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .object {
    > div {
      &.one {
        z-index: 0;
        transform: translateY(-100px);
      }
    }
    &.second {
      > div {
        &.one {
          z-index: 1;
          transform: translateY(-50px);
        }
        &.two {
          transform: translateY(-100px);
          z-index: 0;
        }
      }
    }
    &.third {
      > div {
        &.one {
          transform: translateY(0);
          z-index: 2;
        }
      }
    }
  }
`;

const BtnWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 470px;
  position: fixed;
  bottom: 44px;
  left: 50%;
  transform: translateX(-50%);
  gap: 20px;
  > div {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
  }
  span {
    font-size: 14px;
    color: #333;
    font-weight: 900;
  }
`;

const Button = styled.button`
  color: #fff;
  border: none;
  width: 100%;
  max-width: 140px;
  aspect-ratio: 140 /83;
  transition: all 0.2s linear;
  cursor: pointer;
  &:hover {
    transform: scale(1.1) translateY(-5px);
  }
  &.strawberry {
    background: url(public/ico_icecream_strawberry.svg) no-repeat center / cover;
  }
  &.choco {
    background: url(public/ico_icecream_choco.svg) no-repeat center / cover;
  }
  &.mint-choco {
    background: url(public/ico_icecream_mint.svg) no-repeat center / cover;
  }
`;

const UserList = styled.div`
  background: #fff;
  border-radius: 36px;
  padding: 36px;
  width: 100%;
  max-width: 316px;
  position: fixed;
  top: 90px;
  left: 24px;
  .first-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #444;
    }
    .name {
      display: block;
      margin-top: 18px;
      font-size: 36px;
      font-weight: bold;
      color: #ff3636;
    }
  }
`;

const OtherUser = styled.div`
  display: flex;
  flex-direction: column;
  .index {
    width: 100%;
    padding-bottom: 6px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 12px;
  }
`;
const UserTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  span {
    font-size: 14px;
    color: #333;
  }
`;

const Loading = styled.div`
  width: 100%;
  height: 100%;
  color: red;
  font-size: 16px;
`;

export default function Home() {
  const userId = auth.currentUser.uid;
  const userName = auth.currentUser.displayName;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myRecipeLoading, setMyRecipeLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);
  const [rankList, setRankList] = useState([]);
  const [recipe, setRecipe] = useState([]); // DB에 있는 레시피
  const [myRecipe, setMyRecipe] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState([]);
  const [lastUser, setLastUser] = useState("");
  const [failActive, setFailActive] = useState(false);
  const [successActive, setSuccessActive] = useState(false);

  const fetchRecipe = async () => {
    //DB에 있는 레시피 가져오기
    setLoading(true);
    try {
      const recipeQuery = query(collection(db, "icecream"));
      await onSnapshot(recipeQuery, (snapshot) => {
        const recipe = snapshot.docs.map((doc) => doc.data());
        setRecipe(recipe[0].recipe);
        setLastUser(recipe[0].lastUser);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMyResipeMake = (e) => {
    //내 레시피에 맛 추가하기
    const newMyRecipe = [e, ...myRecipe];
    setMyRecipe(newMyRecipe);
  };

  const matchRecipe = () => {
    // 나의 레시피와 DB레시피를 비교해 정답 유무 확인
    setMyRecipeLoading(true);
    try {
      if (recipe.length !== myRecipe.length) return false;
      for (let i = 0; i < recipe.length; i++) {
        if (recipe[i] !== myRecipe[i]) return false;
      }
      scoreAdd();
      setSuccessActive(true);
      setTimeout(() => {
        setSuccessActive(false);
      }, 1000);
    } catch (e) {
      console.log(e);
    } finally {
      setMyRecipe([]);
      getRankList();
      generateRandomRecipe();
      setMyRecipeLoading(false);
    }
  };

  const shuffleArray = (array) => {
    //랜덤 배열 만드는 이벤트
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const generateRandomRecipe = async () => {
    // 랜덤으로 만든 배열 DB에 업데이트
    const shuffledNumbers = shuffleArray([0, 1, 2]); // 여기서 섞을 숫자를 지정
    setRandomRecipe(shuffledNumbers);
    try {
      await updateDoc(icecreamRef, {
        recipe: shuffledNumbers,
      }); // Firestore 문서 업데이트
    } catch (e) {
      console.log(e);
    }
  };

  const getRankList = async () => {
    //랭킹 리스트 가져오기
    setRankLoading(true);
    try {
      const rankQuery = query(collection(db, "rank"), orderBy("score", "desc"));
      await onSnapshot(rankQuery, (snapshot) => {
        const rankList = snapshot.docs.map((doc) => doc.data());
        setRankList(rankList);
      });
    } catch (e) {
      console.log(e);
    } finally {
      setRankLoading(false);
    }
  };

  const scoreAdd = async () => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, "rank", userId);
    const userDocSnap = await getDoc(userDocRef);
    await updateDoc(icecreamRef, {
      lastUser: userName,
    });
    if (userDocSnap.exists()) {
      const currentScore = userDocSnap.data().score || 0; // score가 없으면 기본값 0
      const newScore = currentScore + 1;
      await updateDoc(userDocRef, { score: newScore });
    } else {
      await setDoc(userDocRef, {
        score: 1,
        userName: userName || "Unknown User",
      });
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  useEffect(() => {
    fetchRecipe();
    getRankList();
  }, []);

  useEffect(() => {
    if (myRecipe.length === 3) {
      matchRecipe();
    }
  }, [myRecipe]); // myRecipe가 변경될 때마다 실행

  return (
    <>
      <Wrapper>
        {/* <Fail className={failActive ? "active" : ""}>실패...</Fail> */}
        <Success className={successActive ? "active" : ""}>
          {userName} 성공!!
        </Success>
        <Header>
          <Logout
            onClick={() => {
              logOut();
            }}
          >
            로그아웃
          </Logout>
        </Header>
        <HeaderTithe>ICECREAM FACTORY</HeaderTithe>
        <RecipeWrapper>
          <Recipe>
            {loading ? (
              <Loading>Loading...</Loading>
            ) : (
              <>
                <p className="title">만들어주세요!</p>
                <div className="object">
                  {recipe.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          item === 0
                            ? "strawberry"
                            : item === 1
                            ? "choco"
                            : "mint"
                        } ${
                          index === 0 ? "one" : index === 1 ? "two" : "three"
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </>
            )}
          </Recipe>
          <MyRecipe>
            {myRecipeLoading ? (
              <Loading>Loading..</Loading>
            ) : (
              <>
                <p className="title">나의 조합</p>
                <div
                  className={`${
                    myRecipe.length === 2
                      ? "second"
                      : myRecipe.length === 3
                      ? "third"
                      : ""
                  } object`}
                >
                  {myRecipe.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          item === 0
                            ? "strawberry"
                            : item === 1
                            ? "choco"
                            : "mint"
                        } ${
                          index === 0 ? "one" : index === 1 ? "two" : "three"
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </>
            )}
          </MyRecipe>
        </RecipeWrapper>
        <BtnWrap>
          <div>
            <Button
              className="strawberry"
              onClick={() => handleMyResipeMake(0)}
            ></Button>
            <Button
              className="choco"
              onClick={() => handleMyResipeMake(1)}
            ></Button>
            <Button
              className="mint-choco"
              onClick={() => handleMyResipeMake(2)}
            ></Button>
          </div>
          <span>SELECT ME!!!</span>
        </BtnWrap>
        <UserList>
          <div className="first-user">
            <p className="title">최고의 실력자</p>
            <span className="name">
              {rankList.length > 0 ? rankList[0].userName : "1등 없음!"}
            </span>
          </div>
          {rankLoading ? (
            <Loading>Loading...</Loading>
          ) : (
            <OtherUser>
              <div className="index">기회가 있는 자</div>
              {rankList.slice(1).map((item, index) => {
                return (
                  <UserTag key={index}>
                    <span>{item.userName}</span>
                    <span>{item.score}</span>
                  </UserTag>
                );
              })}
            </OtherUser>
          )}
        </UserList>
      </Wrapper>
    </>
  );
}
