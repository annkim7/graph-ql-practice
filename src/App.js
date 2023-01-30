import "./App.css";
import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [issue, setIssue] = useState([]);
  const [pull, setPull] = useState([]);

  async function getRepo() {
    const token = process.env.REACT_APP_TOKEN;
    const { repository, viewer } = await graphql(
      `
        {
          repository(name: "agora-states-fe", owner: "codestates-seb") {
            discussions(first: 10) {
              edges {
                node {
                  id
                  title
                  url
                  createdAt
                  author {
                    resourcePath
                  }
                }
              }
            }
            issues(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
            pullRequests(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
          viewer {
            login
          }
        }
      `,
      {
        headers: {
          authorization: `token ${token}`,
        },
      }
    );
    return { repository, viewer };
  }

  useEffect(() => {
    getRepo().then((res) => {
      console.log(res);
      setData(res.repository.discussions.edges);
      setIssue(res.repository.issues.edges);
      setPull(res.repository.pullRequests.edges);
    });
  }, []);

  return (
    <div className="App">
      <div>
        {data.map((el) => {
          return (
            <>
              <div key={el.node.id}>{el.node.title}</div>
            </>
          );
        })}
      </div>

      <h3>Issue</h3>
      <div>
        {issue.map((el) => {
          return <div key={el.node.id}>{el.node.title}</div>;
        })}
      </div>

      <h3>Pull Request</h3>
      <div>
        {pull.map((el) => {
          return <div key={el.node.id}>{el.node.title}</div>;
        })}
      </div>
    </div>
  );
}

export default App;
