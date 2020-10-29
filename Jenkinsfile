pipeline {
 
  agent {
    kubernetes {
      label 'hugo-agent'
      yaml """
apiVersion: v1
metadata:
  labels:
    run: hugo
  name: hugo-pod
spec:
  containers:
    - name: "jnlp"
      image: "eclipsecbi/jiro-agent-basic:remoting-4.2.1"
      volumeMounts:
      - name: "volume-known-hosts"
        mountPath: /home/jenkins/.ssh
      - name: "volume-0"
        mountPath: "/opt/tools"
        readOnly: false
      env:
      - name: "HOME"
        value: "/home/jenkins/agent"
      resources:
        limits:
          memory: "2Gi"
          cpu: "1"
        requests:
          memory: "2Gi"
          cpu: "1"
    - name: hugo
      image: eclipsemosaic/hugo:0.75
      command:
      - cat
      tty: true
  volumes:
  - name: volume-known-hosts
    configMap:
      name: known-hosts
  - name: "volume-0"
    persistentVolumeClaim:
      claimName: "tools-claim-jiro-mosaic"
      readOnly: true
"""
    }
  }
  
  parameters {
    text(name: 'JAVADOC_VERSION', defaultValue: 'keep', description: 'Enter the MOSAIC version to deploy JAVADOC from.')
  }
 
  environment {
    PROJECT_NAME = "mosaic"
    PROJECT_BOT_NAME = "MOSAIC Bot"
  }
 
  triggers { pollSCM('H/10 * * * *') 
 
 }
 
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
    checkoutToSubdirectory('hugo')
  }
 
  stages {
      
    stage('Checkout www repo') {
      steps {
        dir('www') {
            sshagent(['git.eclipse.org-bot-ssh']) {
                sh '''
                    GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git clone ssh://genie.${PROJECT_NAME}@git.eclipse.org:29418/www.eclipse.org/${PROJECT_NAME}.git .
                    if [ "${BRANCH_NAME}" = "main" ]; then git checkout master; else git checkout ${BRANCH_NAME}; fi
                '''
            }
        }
      }
    }
    
    stage('Generate JavaDoc') {
        when {
            expression { params.JAVADOC_VERSION != 'keep' }
        }
        steps {
            dir('mosaic') {
                checkout scm: [$class: 'GitSCM', 
                  userRemoteConfigs: [[url: 'https://github.com/eclipse/mosaic.git']], 
                  branches: [[name: "refs/tags/${params.JAVADOC_VERSION}"]]
                ], poll: false
                sh '/opt/tools/apache-maven/3.6.3/bin/mvn install -DskipTests=true -Dmaven.repo.local=.m2'
                sh '/opt/tools/apache-maven/3.6.3/bin/mvn javadoc:javadoc javadoc:aggregate -DadditionalJOption=-Xdoclint:none -Dmaven.repo.local=.m2'
            }
        }
    }
    
    stage('Backup existing JavaDoc') {
        when {
            expression { params.JAVADOC_VERSION == 'keep' }
        }
        steps {
            dir('mosaic') {
               sh 'mkdir -p target/site/apidocs'
               sh 'cp -Rvf ../www/java_docs/* target/site/apidocs/ || :'
            }
        }
    }
    
    stage('Build website (main) with Hugo') {
      when {
        branch 'main'
      }
      steps {
        container('hugo') {
            dir('hugo') {
                sh 'hugo -b https://www.eclipse.org/${PROJECT_NAME}/'
            }
        }
      }
    }
    stage('Build website (staging) with Hugo') {
      when {
        branch 'staging'
      }
      steps {
        container('hugo') {
            dir('hugo') {
                sh 'hugo -b https://staging.eclipse.org/${PROJECT_NAME}/'
            }
        }
      }
    }
    stage('Push to $env.BRANCH_NAME branch') {
      when {
        anyOf {
          branch "main"
          branch "staging"
        }
      }
      steps {
        sh 'rm -rf www/* && cp -Rvf hugo/public/* www/'
        sh 'mkdir -p www/java_docs && cp -Rvf mosaic/target/site/apidocs/* www/java_docs/ || :'
        dir('www') {
            sshagent(['git.eclipse.org-bot-ssh']) {
                sh '''
                git add -A
                if ! git diff --cached --exit-code; then
                  echo "Changes have been detected, publishing to repo 'www.eclipse.org/${PROJECT_NAME}'"
                  git config --global user.email "${PROJECT_NAME}-bot@eclipse.org"
                  git config --global user.name "${PROJECT_BOT_NAME}"
                  git commit -m "Website build ${JOB_NAME}-${BUILD_NUMBER}"
                  git log --graph --abbrev-commit --date=relative -n 5
                  if [ "${BRANCH_NAME}" = "main" ]; then git push origin HEAD:master; else git push origin HEAD:${BRANCH_NAME}; fi
                else
                  echo "No change have been detected since last build, nothing to publish"
                fi
                '''
            }
        }
      }
    }
  }
}
