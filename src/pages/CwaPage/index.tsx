import { Key, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './cwaPage.scss'
import Layout from '../../components/Template/Layout';
import api from '../../services/Api';
import { Badge, Button, Card, Col, Row, Table, TableColumnsType, Typography, Modal, message, Input, Upload, Divider, ConfigProvider, Spin } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { TableRowSelection } from 'antd/es/table/interface';
import { ClockCircleOutlined, FileSearchOutlined, CloudUploadOutlined, MinusCircleFilled } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
const { Text } = Typography;
const { TextArea } = Input;

interface DataType {
  key: React.Key;
  name: string;
  description: string;
}

interface ExpandedDataType {
  key: React.Key;
  name: string;
  area: string;
  description: string;
  subdisciplina: string;
  state: Object;
}

interface ExpandedData1Type {
  key: React.Key;
  state: Object;
  category: string;
  type: string;
}

interface ExpandedData2Type {
  key: React.Key;
  state: Object;
  content: Object;
}

function CwaPage() {


  const [projectName, setProjectName] = useState('');
  const [dataTable, setDataTable] = useState<any>();
  const [dataTable2, setDataTable2] = useState([]);
  const [dataTable3, setDataTable3] = useState([]);
  const [dataTable4, setDataTable4] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { project_id } = useParams();
  const [selectedKey, setSelectedKey] = useState<Key>();
  const [selectedPage, setSelectedPage] = useState(1);
  const [total, setTotal] = useState();
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [backlog, setBacklog] = useState(false);
  const groupByKey = (list: any, key: any) => list.reduce((hash: any, obj: any) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {})

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Código', dataIndex: 'cwa_code', key: 'cwa_code',
      render: (cwa_code, record) => {
        if (record.key == selectedKey) return <><span style={{ color: 'black' }}>{cwa_code}</span> <a onClick={() => removeRecord(record.key)}><MinusCircleFilled style={{ color: 'red', marginLeft: 20 }} /></a></>;
        return <a style={{ color: 'black' }} onClick={() => navigate("/wps/" + record.key)}>{cwa_code}</a>
      }
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeRecord = (key: Key) => {
    const newData = dataTable.filter((item: any) => item.key !== key);
    setDataTable(newData);
  }

  const expandedRowRender = (record: any): ReactNode => {
    const expandedRowRender = (record: any): ReactNode => {
      const expandedRowRender = (record: any): ReactNode => {
        const expandedRowRender = (record: any): ReactNode => {
          const columns: TableColumnsType<ExpandedData2Type> = [
            { title: 'State', dataIndex: 'state', key: 'state', width: '50px' },
            { title: 'Content', dataIndex: 'content', key: 'content' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
          ];

          const data = [
            {
              key: 11,
              state: <Badge status="success" />,
              content: <a onClick={showModal} style={{ color: '#DA4F37' }}><ClockCircleOutlined style={{ padding: "4px" }} /><FileSearchOutlined style={{ padding: "4px" }} />1. Instalação na base de equipamentos</a>,
              status: 'Em andamento',
            },
            {
              key: 22,
              state: <Badge status="processing" />,
              content: <a style={{ color: '#DA4F37' }}><ClockCircleOutlined style={{ padding: "4px" }} /><FileSearchOutlined style={{ padding: "4px" }} />2. Alinhamento / Nivelamento e demais conexões</a>,
              status: 'Não iniciado',
            },
          ];

          return <Table
            columns={columns}
            dataSource={data}
            showHeader={false}
            pagination={false}
          />;
        }
        const columns: TableColumnsType<ExpandedData2Type> = [
          { title: 'State', dataIndex: 'state', key: 'state', width: '30px' },
          { title: 'Content', dataIndex: 'content', key: 'content' },
        ];


        //Table 4
        return <Table columns={columns}
          dataSource={dataTable4[record.key]}
          expandable={{ expandedRowRender }}
          showHeader={false}
          pagination={false} />;

      }
      const columns: TableColumnsType<ExpandedData1Type> = [
        { title: 'Content', dataIndex: 'content', key: 'content', width: '25%' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
      ];


      //Table 3
      return <Table columns={columns}
        dataSource={dataTable3[record.id]}
        expandable={{ expandedRowRender }}
        onExpandedRowsChange={(e) => setExpandedData3(e[e.length - 1])}
        showHeader={false}
        pagination={false} />;

    }

    const columns: TableColumnsType<ExpandedDataType> = [
      { title: 'Nome', dataIndex: 'name', key: 'name', render: (name, record) => (<a style={{ color: 'black' }} onClick={() => navigate("/wp/view/" + record.key)}>{name}</a>) },
      { title: 'Descrição', dataIndex: 'description', key: 'description' },
      { title: 'Disciplina', dataIndex: 'discipline_name', key: 'discipline_name' },
      { title: 'Subdisciplina', dataIndex: 'sub_discipline_name', key: 'sub_discipline_name' },
      { title: 'Status', dataIndex: 'state', key: 'state' },
    ];


    // Table 2
    return <Table columns={columns}
      dataSource={dataTable2[record.id]}
      onExpandedRowsChange={(e) => setExpandedData2(e[e.length - 1])}
      expandable={{ expandedRowRender }}
      pagination={false} />;

  };

  const rowSelection: TableRowSelection<DataType> = {
    onSelect: (record) => {
      setSelectedKey(record.key);
    },
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const setExpandedData1 = (key: Key) => {
    if (!key) return false;
    api.get("/v1/cwas/" + key + "/wps?page=" + selectedPage)
      .then((response) => {
        // setFetchingData2(true)
        if (response.status === 200) {
          const data1 = response.data.data.map((obj: any) => ({
            ...obj,
            key: obj.id,
            description: obj.discipline_name,
            subdisciplina: obj.sub_discipline_name,
            area: 'Geral',
            state: 'Finalizado'
          }));
          setDataTable2({ ...dataTable2, [key]: data1 });
        }
      });
  }

  const setExpandedData2 = async (key: Key) => {
    if (!key) return false;
    await api.get(`v1/wps/${key}/activities`)
      .then((response) => {
        if (response.status === 200) {
          const types = Object.keys(groupByKey(response.data.data, 'type'));
          var data2 = [];
          if (types.includes('EWP'))
            data2.push({
              key: key + '-ewp',
              content: 'Engenharia',
              type: 'EWP',
            })
          if (types.includes('PWP'))
            data2.push({
              key: key + '-pwp',
              content: 'Fornecimento',
              type: 'PWP',
            })
          if (types.includes('CWP'))
            data2.push({
              key: key + '-cwp',
              content: 'Construção',
              type: 'CWP',
            })

          setDataTable3({ ...dataTable3, [key]: data2 });

        }
      });
  }

  const setExpandedData3 = async (key: Key) => {
    if (!key) return false;
    const arr = key.toString().split('-');
    await api.get(`/v1/wps/${arr[0]}/activities/${arr[1]}`)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.data.map((obj: any) => ({
            key: obj.id,
            status: 1,
            content: obj.name,
          }));
          setDataTable4({ ...dataTable4, [key]: data });
        }
      });
  }

  useEffect(() => {
    api.get("/v1/projects/" + project_id)
      .then((response) => {
        if (response.status === 200) {
          setProjectName(response.data.name)
        }
      });


    api.get(`/v1/projects/${project_id}/cwas?page=${selectedPage}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          const data = response.data.data;
          const table = data.map((obj: any) => ({
            ...obj,
            key: obj.id,
            actions: <>
              <Button type="primary" onClick={() => navigate("/cwas/" + obj.id)}>
                Abrir
              </Button>
            </>
          }));
          setTotal(response.data.total);
          setPageSize(response.data.per_page);
          setDataTable(table);
        }
      });
  }, [selectedPage]);


  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <Spin />
    </div>
  );

  const onChange: PaginationProps['onChange'] = (page) => {
    setSelectedPage(page);
  };


  return (
    <>
      <Layout breadcrumb={projectName ?? '_'}>
        <Card size="small" title="CWA - Áreas do Projeto" extra={''}>
          <Row>
            <Col span={24} style={{ overflow: 'auto' }}>
              <ConfigProvider renderEmpty={customizeRenderEmpty}>
                <Table
                  className='table-cwa'
                  columns={columns}
                  rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                  }}
                  expandable={{ expandedRowRender }}
                  onExpandedRowsChange={(e) => setExpandedData1(e[e.length - 1])}
                  dataSource={dataTable}
                  pagination={false}
                  // scroll={{ y: 350 }}
                  size='small'
                  style={{ minWidth: '600px' }}
                />
              </ConfigProvider>
            </Col>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
            <Pagination current={selectedPage} onChange={onChange} pageSize={pageSize} total={total} />
          </Row>
          {/* <Row justify={'center'} className='table-insert'>
            <Col span={7} onClick={() => navigate("/cwas_edit/" + project_id)}><Input placeholder="Nome" /></Col>
            <Col span={12} onClick={() => navigate("/cwas_edit/" + project_id)}><Input placeholder="Descrição" /></Col>
            <Col span={4} sm={3} lg={2}><Button type="primary">Inserir</Button></Col>
          </Row> */}
        </Card>
        <Modal footer={null} closeIcon={true} width={600} className='measure-modal' open={isModalOpen} onCancel={handleCancel}>
          <Row>
            <Col span={24} className='measure-modal-header'>
              Medição
            </Col>
          </Row>
          <Row className='measure-modal-sub-header'>
            <Col span={24}>
              <Row>
                <Col className='modal-name' span={24}>KN-N1344-290-M-EM-0001</Col>
              </Row>
              <Row>
                <Col className='modal-description text-ellipsis' span={24}>Montar equipamentos mecânicos - CH-1290KN-01</Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24} className='modal-body'>
              <Row justify={'space-between'} style={{ padding: '10px 0px' }}>
                <Col>1. Instalação na base de equipamentos</Col>
                <Col>R$80.750</Col>
              </Row>
              <Row>
                <Col span={24}>
                  <TextArea rows={4} placeholder='Comentários' />
                </Col>
              </Row>
              <Row style={{ padding: '10px 0px' }}>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Upload {...props} showUploadList={false} className='upload-cloud-btn'>
                    <Button icon={<CloudUploadOutlined />}>Selecionar arquivos...</Button>
                  </Upload>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Button onClick={handleUpload} className='modal-upload-button' disabled={fileList.length === 0} loading={uploading} type="primary">Submeter para aprovação</Button>
                </Col>
              </Row>
              <Divider orientation="left" style={{ margin: '0px' }} plain>
                Lista de arquivos
              </Divider>
              <Upload className='uploaded-file-list' fileList={fileList}></Upload>
              <Divider orientation="left" style={{ margin: '0px' }} plain>
                Histórico
              </Divider>
              <div style={{ minHeight: '100px', paddingLeft: '30px' }}>
                <div className='text-ellipsis'>03/05/2023 às 15h18: Atividade realizada em campo sem impedimento.</div>
                <div className='text-ellipsis'>03/05/2023 às 15h23: Submetido para aprovação.</div>
              </div>
            </Col>
          </Row>
        </Modal>
      </Layout>
    </>
  );
}

export default CwaPage;
