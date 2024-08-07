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

const icecreamRef = doc(db, "icecream", "Mtu2EMz2fp8FKkItKQm5");

const Wrapper = styled.div``;

const Header = styled.header``;

const HeaderTithe = styled.h1``;

const Recipe = styled.div`
  span {
    display: block;
    width: 80px;
    height: 20px;
    &.strawberry {
      background-color: #ff4a4a;
    }
    &.choco {
      background-color: #2e2011;
    }
    &.mint-choco {
      background-color: #4bde94;
    }
  }
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  color: #fff;
  border: none;
  width: 100px;
  aspect-ratio: 1/1;
  border-radius: 16px;
  &.strawberry {
    background-color: #ff4a4a;
  }
  &.choco {
    background-color: #2e2011;
  }
  &.mint-choco {
    background-color: #4bde94;
  }
`;

const UserList = styled.div`
  .my-name {
    font: 14px;
    color: red;
  }
`;

const MyRecipe = styled.div`
  span {
    display: block;
    width: 80px;
    height: 20px;
    &.strawberry {
      background-color: #ff4a4a;
    }
    &.choco {
      background-color: #2e2011;
    }
    &.mint-choco {
      background-color: #4bde94;
    }
  }
`;

const Loading = styled.div`
  color: red;
`;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [myRecipeLoading, setMyRecipeLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);
  const [rankList, setRankList] = useState([]);
  const [recipe, setRecipe] = useState([]); // DB에 있는 레시피
  const [myRecipe, setMyRecipe] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState([]);
  const [lastUser, setLastUser] = useState("");

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
    try {
      setMyRecipeLoading(true);
      if (recipe.length !== myRecipe.length) return false;
      for (let i = 0; i < recipe.length; i++) {
        if (recipe[i] !== myRecipe[i]) return false;
      }
      return console.log("정답");
    } catch (e) {
      console.log(e);
    } finally {
      setMyRecipe([]);
      setMyRecipeLoading(false);
      scoreAdd();
      getRankList();
      generateRandomRecipe();
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
        lastUser: auth.currentUser.displayName,
      }); // Firestore 문서 업데이트
    } catch (e) {
      console.log(e);
    } finally {
      setLastUser(auth.currentUser.displayName);
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
    const userDocRef = doc(db, "rank", auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const currentScore = userDocSnap.data().score || 0; // score가 없으면 기본값 0
      const newScore = currentScore + 1;
      await updateDoc(userDocRef, { score: newScore });
    } else {
      await setDoc(userDocRef, {
        score: 1,
        userName: auth.currentUser.displayName || "Unknown User",
      });
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
      <Header></Header>
      <Wrapper>
        <Recipe>
          {loading ? (
            <Loading>Loading...</Loading>
          ) : (
            <>
              <p>
                레시피 정보 나옴:
                {recipe.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={
                        item === 0
                          ? "strawberry"
                          : item === 1
                          ? "choco"
                          : "mint-choco"
                      }
                    ></span>
                  );
                })}
              </p>
              <div className="last-user">마지막 정답자: {lastUser}</div>
            </>
          )}
        </Recipe>
        <MyRecipe>
          {myRecipeLoading ? (
            <Loading>Loading..</Loading>
          ) : (
            <>
              {myRecipe.map((item, index) => {
                return (
                  <span
                    key={index}
                    className={
                      item === 0
                        ? "strawberry"
                        : item === 1
                        ? "choco"
                        : "mint-choco"
                    }
                  ></span>
                );
              })}
            </>
          )}
        </MyRecipe>
        <BtnWrap>
          <Button className="strawberry" onClick={() => handleMyResipeMake(0)}>
            딸기맛
          </Button>
          <Button className="choco" onClick={() => handleMyResipeMake(1)}>
            초코맛
          </Button>
          <Button className="mint-choco" onClick={() => handleMyResipeMake(2)}>
            민트초코맛
          </Button>
        </BtnWrap>
        <UserList>
          <div className="my-name">
            로그인한 계정: {auth.currentUser.displayName}
          </div>
          {rankLoading ? (
            <Loading>Loading...</Loading>
          ) : (
            <>
              {rankList.map((item, index) => {
                return (
                  <div key={index}>
                    {item.userName} / 점수
                    {item.score}
                  </div>
                );
              })}
            </>
          )}
        </UserList>
      </Wrapper>
    </>
  );
}
