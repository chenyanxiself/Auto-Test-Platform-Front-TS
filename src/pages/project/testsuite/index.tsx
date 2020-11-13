import React from 'react';
import {Card, Button, Menu, Modal, message, Table, Form, Checkbox} from 'antd'
import styles from './index.less'
// import ProjectSuiteModifyModal from "../../components/project-suite/ProjectSuiteModifyModal";
// import {
//   getSuiteByProjectId,
//   getSuiteInfoById,
//   createSuite,
//   deleteSuite,
//   updateSuiteCaseRelation,
//   updateSuiteCaseSort,
//   executeSuite
// } from './service'
// import ProjectSuiteCreateModal from '../../components/project-suite/ProjectSuiteCreateModal'
import {ExclamationCircleOutlined, PlayCircleOutlined} from '@ant-design/icons';
import {HTML5Backend} from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import component from '@/pages/project/components/dndComponent'
import {DndProvider} from 'react-dnd'
import Host from "@/pages/project/apicase/components/createApiCaseModal/Host";
import RequestArgsModal from "@/pages/project/apicase/components/createApiCaseModal/RequestArgsModal";

const {confirm} = Modal

const TestSuite = (props)=>{
  return <div>project-overview</div>
}

export default TestSuite
