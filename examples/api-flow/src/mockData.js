export const mockSchema = {
  oneapi: "1.0.0",
  info: {
    title: "transparentreg",
    version: "1.0.0.1649839837322",
    extensions: {
      "x-info": {
        "x-parser-type": "java",
        "x-parser-version": "1.8.13",
      },
      "x-jar-gav": {
        crab: {
          groupId: "com.alibaba",
          artifactId: "crab",
          version: "1.0.2",
          ossDist: [],
        },
        "spring-data-commons": {
          groupId: "org.springframework.data",
          artifactId: "spring-data-commons",
          version: "2.1.6.RELEASE",
          ossDist: [],
        },
        "transparent.reg-common-service-facade": {
          groupId: "com.alipay.transparent.reg",
          artifactId: "transparent.reg-common-service-facade",
          version: "1.0.0.20191107",
          ossDist: [],
        },
      },
    },
  },
  definitions: {
    ApiResult: {
      title: "ApiResult",
      description: "",
      type: "object",
      properties: {
        status: {
          type: "boolean",
          description: "执行结果状态",
          extensions: {
            "x-java-type": "java.lang.Boolean",
          },
        },
        code: {
          type: "string",
          description: "执行结果状态码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        msg: {
          type: "string",
          description: "执行结果返回消息",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        data: {
          type: "object",
          properties: {},
          description: "json数据data字段",
          extensions: {
            "x-generic-index": 0,
            "x-generic-name": "T",
            "x-generic-type-var": true,
          },
        },
        pagination: {
          description: "分页信息",
          $ref: "#/definitions/Pagination",
          extensions: {
            "x-java-type": "com.alipay.transparent.reg.web.util.Pagination",
          },
        },
      },
      extensions: {
        "x-java-type": "com.alipay.transparent.reg.web.util.ApiResult",
        "x-generic-item": [
          {
            "x-generic-name": "T",
          },
        ],
      },
    },
    ApiResult_FilePreviewVO_: {
      title: "ApiResult_FilePreviewVO_",
      description: "",
      type: "object",
      properties: {
        status: {
          type: "boolean",
          description: "执行结果状态",
          extensions: {
            "x-java-type": "java.lang.Boolean",
          },
        },
        code: {
          type: "string",
          description: "执行结果状态码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        msg: {
          type: "string",
          description: "执行结果返回消息",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        data: {
          description: "json数据data字段",
          $ref: "#/definitions/FilePreviewVO",
          extensions: {
            "x-java-type": "com.alipay.transparent.reg.biz.model.FilePreviewVO",
            "x-generic-type-var": true,
          },
        },
        pagination: {
          description: "分页信息",
          $ref: "#/definitions/Pagination",
          extensions: {
            "x-java-type": "com.alipay.transparent.reg.web.util.Pagination",
          },
        },
      },
      extensions: {
        "x-java-type": "com.alipay.transparent.reg.web.util.ApiResult",
        "x-generic-union": true,
        "x-generic-item": [
          {
            "x-java-type": "com.alipay.transparent.reg.biz.model.FilePreviewVO",
          },
        ],
      },
    },
    BaseAdvancedQuery: {
      title: "BaseAdvancedQuery",
      description: "",
      type: "object",
      properties: {
        orderByFieldName: {
          type: "string",
          description: "排序的字段名",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        descOrAsc: {
          type: "string",
          description: "排序时，是升序还是降序  - 使用上述常量",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        pageNo: {
          type: "integer",
          description:
            "当前需要查询的页数  -  分页查询 第一页的页号 为 1 该字段不为null的时候，表明启用分页查询",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        pageSize: {
          type: "integer",
          description: "单页返回记录上限数    -  分页查询",
          default: 20,
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        limitCount: {
          type: "integer",
          description:
            "限制返回记录上限数 该值不为null的时候启用，并使用该值作为参数",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        returnDbFieldName: {
          type: "string",
          description:
            "返回的字段名  可以配合distinct使用 用于查询满足查询条件，只需返回某一单个字段的场景",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        distinct: {
          type: "integer",
          description:
            "是否启用distinct的功能 如果是查询某字段时启用，则去重返回字段 如果是计数某字段时启用，则计数时去掉重复的值",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        countFieldName: {
          type: "string",
          description: "计数时的字段   可以配合distinct使用",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        offset: {
          type: "integer",
          description: "从哪一条开始查",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.common.util.page.BaseAdvancedQuery",
      },
    },
    BaseRequest: {
      title: "BaseRequest",
      description: "",
      type: "object",
      properties: {},
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.BaseRequest",
      },
    },
    FilePreviewVO: {
      title: "FilePreviewVO",
      description: "文件预览",
      type: "object",
      properties: {
        businessId: {
          type: "string",
          description: "业务ID，用作幂等",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        status: {
          type: "string",
          description: "任务执行状态",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        url: {
          type: "string",
          description: "预览地址",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        accessToken: {
          type: "string",
          description: "Access Token",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        expiredTime: {
          type: "string",
          description: "Access Token Expired Time",
          format: "date",
          extensions: {
            "x-java-type": "java.util.Date",
          },
        },
      },
      extensions: {
        "x-java-type": "com.alipay.transparent.reg.biz.model.FilePreviewVO",
      },
    },
    HttpServletRequest: {
      title: "HttpServletRequest",
      type: "object",
      properties: {},
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.web.home.javax.servlet.http.HttpServletRequest",
      },
    },
    HttpServletResponse: {
      title: "HttpServletResponse",
      type: "object",
      properties: {},
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.web.home.javax.servlet.http.HttpServletResponse",
      },
    },
    InspectionFileEditBO: {
      title: "InspectionFileEditBO",
      description: "",
      type: "object",
      properties: {
        inspectPointCode: {
          type: "string",
          description: "自查要点编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        fileKeys: {
          type: "string",
          description: "文件keys",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionFileEditBO",
        "x-parent-class":
          "com.alipay.transparent.reg.service.impl.inspection.param.BaseRequest",
      },
    },
    InspectionListQuery: {
      title: "InspectionListQuery",
      description: "",
      type: "object",
      properties: {
        inspectOrg: {
          type: "string",
          description: "自查部门",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectExecutor: {
          type: "string",
          description: "自查执行人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectContacter: {
          type: "string",
          description: "合规对接人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectProcess: {
          type: "string",
          description: "自查进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectPointDescription: {
          type: "string",
          description: "自查要点描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsCode: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsName: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectRegulatoryCodes: {
          type: "string",
          description: "框架全层级",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionExecution: {
          type: "string",
          description: "业务执行情况",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        importance: {
          type: "string",
          description: "重要程度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.common.repository.inspection.param.InspectionListQuery",
      },
    },
    InspectionPointBO: {
      title: "InspectionPointBO",
      description: "",
      type: "object",
      properties: {
        inspectPointDescription: {
          type: "string",
          description: "自查要点描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectRegulatoryCodes: {
          type: "string",
          description: "自查要点对应全领域层级编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsCode: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsName: {
          type: "string",
          description: "法规名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        lawCodes: {
          type: "string",
          description: "法条编码集",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectOrg: {
          type: "string",
          description: "自查部门编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectExecutor: {
          type: "string",
          description: "自查执行人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectContacter: {
          type: "string",
          description: "自查对接人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionCode: {
          type: "string",
          description: "制度编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionName: {
          type: "string",
          description: "制度名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionExecution: {
          type: "string",
          description: "制度执行情况",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        problemDescription: {
          type: "string",
          description: "问题描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        fileKeys: {
          type: "string",
          description: "文件key值列表",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectProcess: {
          type: "string",
          description: "自查进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        operator: {
          type: "string",
          description: "操作人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        importance: {
          type: "string",
          description: "重要程度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointBO",
        "x-parent-class":
          "com.alipay.transparent.reg.service.impl.inspection.param.BaseRequest",
      },
    },
    InspectionPointDetailBO: {
      title: "InspectionPointDetailBO",
      description: "",
      type: "object",
      properties: {
        inspectPointDescription: {
          type: "string",
          description: "自查要点描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectRegulatoryCodes: {
          type: "string",
          description: "自查要点对应全领域层级编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsCode: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsName: {
          type: "string",
          description: "法规名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        lawCodes: {
          type: "string",
          description: "法条编码集",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectOrg: {
          type: "string",
          description: "自查部门编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectExecutor: {
          type: "string",
          description: "自查执行人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectContacter: {
          type: "string",
          description: "自查对接人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionCode: {
          type: "string",
          description: "制度编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionName: {
          type: "string",
          description: "制度名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionExecution: {
          type: "string",
          description: "制度执行情况",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        problemDescription: {
          type: "string",
          description: "问题描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        fileKeys: {
          type: "string",
          description: "文件key值列表",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectProcess: {
          type: "string",
          description: "自查进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        operator: {
          type: "string",
          description: "操作人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        importance: {
          type: "string",
          description: "重要程度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectPointCode: {
          type: "string",
          description: "自查要点编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectOrgName: {
          type: "string",
          description: "自查部门名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        historyProcessList: {
          type: "array",
          description: "历史进度列表",
          items: {
            $ref: "#/definitions/InspectionScheduleBO",
          },
          extensions: {
            "x-java-type": "java.util.List",
            "x-generic-item": [
              {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionScheduleBO",
              },
            ],
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointDetailBO",
        "x-parent-class":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointEditBO",
      },
    },
    InspectionPointEditBO: {
      title: "InspectionPointEditBO",
      description: "",
      type: "object",
      properties: {
        inspectPointDescription: {
          type: "string",
          description: "自查要点描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectRegulatoryCodes: {
          type: "string",
          description: "自查要点对应全领域层级编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsCode: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsName: {
          type: "string",
          description: "法规名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        lawCodes: {
          type: "string",
          description: "法条编码集",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectOrg: {
          type: "string",
          description: "自查部门编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectExecutor: {
          type: "string",
          description: "自查执行人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectContacter: {
          type: "string",
          description: "自查对接人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionCode: {
          type: "string",
          description: "制度编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionName: {
          type: "string",
          description: "制度名称",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionExecution: {
          type: "string",
          description: "制度执行情况",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        problemDescription: {
          type: "string",
          description: "问题描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        fileKeys: {
          type: "string",
          description: "文件key值列表",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectProcess: {
          type: "string",
          description: "自查进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        operator: {
          type: "string",
          description: "操作人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        importance: {
          type: "string",
          description: "重要程度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectPointCode: {
          type: "string",
          description: "自查要点编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointEditBO",
        "x-parent-class":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointBO",
      },
    },
    InspectionPointListResultBO: {
      title: "InspectionPointListResultBO",
      description: "",
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "自查要点列表查询结果",
          items: {
            $ref: "#/definitions/InspectionPointDetailBO",
          },
          extensions: {
            "x-java-type": "java.util.List",
            "x-generic-item": [
              {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointDetailBO",
              },
            ],
          },
        },
        total: {
          type: "integer",
          description: "查询结果总数",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        userType: {
          type: "string",
          description: "用户类型",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointListResultBO",
      },
    },
    InspectionPointQueryRequest: {
      title: "InspectionPointQueryRequest",
      description: "",
      type: "object",
      properties: {
        inspectOrg: {
          type: "string",
          description: "自查部门",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectExecutor: {
          type: "string",
          description: "自查执行人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectContacter: {
          type: "string",
          description: "合规对接人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectProcess: {
          type: "string",
          description: "自查进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectPointDescription: {
          type: "string",
          description: "自查要点描述",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsCode: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        regulationsName: {
          type: "string",
          description: "法规编码",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        inspectRegulatoryCodes: {
          type: "string",
          description: "框架全层级",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        institutionExecution: {
          type: "string",
          description: "业务执行情况",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        importance: {
          type: "string",
          description: "重要程度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        pageInfo: {
          description: "分页类信息",
          $ref: "#/definitions/BaseAdvancedQuery",
          extensions: {
            "x-java-type":
              "com.alipay.transparent.reg.common.util.page.BaseAdvancedQuery",
          },
        },
        defaultUser: {
          type: "string",
          description: "默认用户",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.query.InspectionPointQueryRequest",
        "x-parent-class":
          "com.alipay.transparent.reg.common.repository.inspection.param.InspectionListQuery",
      },
    },
    InspectionScheduleBO: {
      title: "InspectionScheduleBO",
      description: "",
      type: "object",
      properties: {
        inspectProcess: {
          type: "string",
          description: "历史节点进度",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        operator: {
          type: "string",
          description: "操作人",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        gmtCreate: {
          type: "string",
          description: "创建时间",
          format: "date",
          extensions: {
            "x-java-type": "java.util.Date",
          },
        },
      },
      extensions: {
        "x-java-type":
          "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionScheduleBO",
      },
    },
    OneApiResult_List_string_: {
      title: "OneApiResult_List_string_",
      type: "array",
      items: {
        type: "string",
      },
      extensions: {
        "x-is-array": true,
        "x-array-deep": 1,
        "x-java-type": "byte",
      },
    },
    OneApiResult_object_: {
      title: "OneApiResult_object_",
      type: "object",
      properties: {},
      extensions: {
        "x-java-type": "java.lang.Object",
      },
    },
    OneApiResult_string_: {
      title: "OneApiResult_string_",
      type: "object",
      properties: {},
      extensions: {
        "x-java-type": "java.lang.String",
      },
    },
    Pagination: {
      title: "Pagination",
      description: "",
      type: "object",
      properties: {
        currentPage: {
          type: "integer",
          format: "int32",
          extensions: {
            "x-java-type": "int",
          },
        },
        total: {
          type: "integer",
          format: "int32",
          extensions: {
            "x-java-type": "int",
          },
        },
        pageSize: {
          type: "integer",
          format: "int32",
          extensions: {
            "x-java-type": "int",
          },
        },
      },
      extensions: {
        "x-java-type": "com.alipay.transparent.reg.web.util.Pagination",
      },
    },
    RcServUserInfo: {
      title: "RcServUserInfo",
      description: "中台交互的用户服务信息",
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "user id",
          format: "int32",
          extensions: {
            "x-java-type": "java.lang.Integer",
          },
        },
        empId: {
          type: "string",
          description: "work id",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        lastName: {
          type: "string",
          description: "last name",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        nickNameCn: {
          type: "string",
          description: "flower name",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        emailAddr: {
          type: "string",
          description: "email address",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        corpId: {
          type: "string",
          description: "我也不知道这是啥",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        corpUserId: {
          type: "string",
          description: "我也不知道这是啥",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        aliWW: {
          type: "string",
          description: "我也不知道这是啥",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        tbWW: {
          type: "string",
          description: "我也不知道这是啥",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        accountFrom: {
          type: "string",
          description: "account所来自哪个子系统",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        depId: {
          type: "string",
          description: "部门ID",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        depDesc: {
          type: "string",
          description: "部门name",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
        language: {
          type: "string",
          description: "语言",
          extensions: {
            "x-java-type": "java.lang.String",
          },
        },
      },
      extensions: {
        "x-java-type": "com.alipay.rcservcenter.client.bean.RcServUserInfo",
      },
    },
  },
  apis: {
    "DiController.getToken": {
      meta: {
        namespace: "DiController",
        method: "getToken",
        description: "获得用户access信息\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/di/token",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "DiController.getTokenUsingPOST": {
      meta: {
        namespace: "DiController",
        method: "getTokenUsingPOST",
        description: "获得用户access信息\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/di/token",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "DiController.initUser": {
      meta: {
        namespace: "DiController",
        method: "initUser",
        description: "初始化一个用户\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/di/init",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "DiController.initUserUsingPOST": {
      meta: {
        namespace: "DiController",
        method: "initUserUsingPOST",
        description: "初始化一个用户\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/di/init",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "FileDownController.fileDownload": {
      meta: {
        namespace: "FileDownController",
        method: "fileDownload",
        description: "文件下载",
        contentType: "application/json",
        request: [
          {
            id: "#FileDownController-fileDownload-request-2",
            title: "fileKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/fileDownload/fileDownload.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileDownController-fileDownload-request-2",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "FileDownController.fileDownloadUsingPOST": {
      meta: {
        namespace: "FileDownController",
        method: "fileDownloadUsingPOST",
        description: "文件下载",
        contentType: "application/json",
        request: [
          {
            id: "#FileDownController-fileDownload-request-2",
            title: "fileKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/fileDownload/fileDownload.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileDownController-fileDownload-request-2",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileView": {
      meta: {
        namespace: "FileViewController",
        method: "fileView",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingDELETE": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingDELETE",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingHEAD": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingHEAD",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "HEAD",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingOPTIONS": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingOPTIONS",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "OPTIONS",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingPATCH": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingPATCH",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "PATCH",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingPOST": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingPOST",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.fileViewUsingPUT": {
      meta: {
        namespace: "FileViewController",
        method: "fileViewUsingPUT",
        description: "文件在线预览\n@param ossKey\n@param response\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-fileView-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_List_string_",
        },
      },
      protocols: {
        http: {
          method: "PUT",
          path: "/fc/fileView/fileView",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-fileView-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_List_string_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURL": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURL",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingDELETE": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingDELETE",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingHEAD": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingHEAD",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "HEAD",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingOPTIONS": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingOPTIONS",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "OPTIONS",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingPATCH": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingPATCH",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "PATCH",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingPOST": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingPOST",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getOfficePreviewURLUsingPUT": {
      meta: {
        namespace: "FileViewController",
        method: "getOfficePreviewURLUsingPUT",
        description: "获取预览地址和AccessToken\n@param ossKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getOfficePreviewURL-request-0",
            title: "ossKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "PUT",
          path: "/fc/fileView/getOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURL": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURL",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingDELETE": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingDELETE",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingHEAD": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingHEAD",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "HEAD",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingOPTIONS": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingOPTIONS",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "OPTIONS",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingPATCH": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingPATCH",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "PATCH",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingPOST": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingPOST",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "FileViewController.getZhiDuJiaYuanOfficePreviewURLUsingPUT": {
      meta: {
        namespace: "FileViewController",
        method: "getZhiDuJiaYuanOfficePreviewURLUsingPUT",
        description:
          "获取预览地址和AccessToken\n@param zhiDuJiaYuanOssKey\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
            title: "zhiDuJiaYuanOssKey",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult_FilePreviewVO_",
        },
      },
      protocols: {
        http: {
          method: "PUT",
          path: "/fc/fileView/getZhiDuJiaYuanOfficePreviewURL",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#FileViewController-getZhiDuJiaYuanOfficePreviewURL-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult_FilePreviewVO_",
              },
            },
          },
        },
      },
    },
    "InspectionManager.addInspectionPoint": {
      meta: {
        namespace: "InspectionManager",
        method: "addInspectionPoint",
        description:
          "新增自查要点\n@param inspectionPointBO the inspection point bo\n@param userInfo          the user info\n@return the result\n",
        request: [
          {
            id: "#InspectionManager-addInspectionPoint-request-0",
            title: "inspectionPointBO",
            description: "the inspection point bo",
            $ref: "#/definitions/InspectionPointBO",
            schema: {
              $ref: "#/definitions/InspectionPointBO",
            },
          },
          {
            id: "#InspectionManager-addInspectionPoint-request-1",
            title: "userInfo",
            description: "the user info",
            $ref: "#/definitions/RcServUserInfo",
            schema: {
              $ref: "#/definitions/RcServUserInfo",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_string_",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-addInspectionPoint-request-0",
              name: "inspectionPointBO",
              description: "the inspection point bo",
              schema: {
                $ref: "#/definitions/InspectionPointBO",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointBO",
              },
            },
            {
              id: "#InspectionManager-addInspectionPoint-request-1",
              name: "userInfo",
              description: "the user info",
              schema: {
                $ref: "#/definitions/RcServUserInfo",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.rcservcenter.client.bean.RcServUserInfo",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/OneApiResult_string_",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.addInspectionPoint",
          artifactId: "",
        },
      },
    },
    "InspectionManager.deleteInspectionPoint": {
      meta: {
        namespace: "InspectionManager",
        method: "deleteInspectionPoint",
        description:
          "删除自查要点\n@param data 自查要点编号\n@param userInfo 用户信息\n@return the result\n",
        request: [
          {
            id: "#InspectionManager-deleteInspectionPoint-request-0",
            title: "data",
            description: "自查要点编号",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#InspectionManager-deleteInspectionPoint-request-1",
            title: "userInfo",
            description: "用户信息",
            $ref: "#/definitions/RcServUserInfo",
            schema: {
              $ref: "#/definitions/RcServUserInfo",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_string_",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-deleteInspectionPoint-request-0",
              name: "data",
              description: "自查要点编号",
              type: "string",
              schema: {
                type: "string",
              },
              extensions: {
                "x-java-type": "java.lang.String",
              },
            },
            {
              id: "#InspectionManager-deleteInspectionPoint-request-1",
              name: "userInfo",
              description: "用户信息",
              schema: {
                $ref: "#/definitions/RcServUserInfo",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.rcservcenter.client.bean.RcServUserInfo",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/OneApiResult_string_",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.deleteInspectionPoint",
          artifactId: "",
        },
      },
    },
    "InspectionManager.editInspectFileKeys": {
      meta: {
        namespace: "InspectionManager",
        method: "editInspectFileKeys",
        description:
          "自查要点 - 文件列表更新\n@param inspectionFileEditBO the inspection point edit bo\n@param userInfo the user info\n@return the result\n",
        request: [
          {
            id: "#InspectionManager-editInspectFileKeys-request-0",
            title: "inspectionFileEditBO",
            description: "the inspection point edit bo",
            $ref: "#/definitions/InspectionFileEditBO",
            schema: {
              $ref: "#/definitions/InspectionFileEditBO",
            },
          },
          {
            id: "#InspectionManager-editInspectFileKeys-request-1",
            title: "userInfo",
            description: "the user info",
            $ref: "#/definitions/RcServUserInfo",
            schema: {
              $ref: "#/definitions/RcServUserInfo",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_string_",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-editInspectFileKeys-request-0",
              name: "inspectionFileEditBO",
              description: "the inspection point edit bo",
              schema: {
                $ref: "#/definitions/InspectionFileEditBO",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionFileEditBO",
              },
            },
            {
              id: "#InspectionManager-editInspectFileKeys-request-1",
              name: "userInfo",
              description: "the user info",
              schema: {
                $ref: "#/definitions/RcServUserInfo",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.rcservcenter.client.bean.RcServUserInfo",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/OneApiResult_string_",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.editInspectFileKeys",
          artifactId: "",
        },
      },
    },
    "InspectionManager.editInspectionPoint": {
      meta: {
        namespace: "InspectionManager",
        method: "editInspectionPoint",
        description:
          "编辑自查要点\n@param inspectionPointEditBO the inspection point edit bo\n@param userInfo              the user info\n@return the result\n",
        request: [
          {
            id: "#InspectionManager-editInspectionPoint-request-0",
            title: "inspectionPointEditBO",
            description: "the inspection point edit bo",
            $ref: "#/definitions/InspectionPointEditBO",
            schema: {
              $ref: "#/definitions/InspectionPointEditBO",
            },
          },
          {
            id: "#InspectionManager-editInspectionPoint-request-1",
            title: "userInfo",
            description: "the user info",
            $ref: "#/definitions/RcServUserInfo",
            schema: {
              $ref: "#/definitions/RcServUserInfo",
            },
          },
        ],
        response: {
          $ref: "#/definitions/OneApiResult_string_",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-editInspectionPoint-request-0",
              name: "inspectionPointEditBO",
              description: "the inspection point edit bo",
              schema: {
                $ref: "#/definitions/InspectionPointEditBO",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.bo.InspectionPointEditBO",
              },
            },
            {
              id: "#InspectionManager-editInspectionPoint-request-1",
              name: "userInfo",
              description: "the user info",
              schema: {
                $ref: "#/definitions/RcServUserInfo",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.rcservcenter.client.bean.RcServUserInfo",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/OneApiResult_string_",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.editInspectionPoint",
          artifactId: "",
        },
      },
    },
    "InspectionManager.queryInspectionDetailByCode": {
      meta: {
        namespace: "InspectionManager",
        method: "queryInspectionDetailByCode",
        description:
          "根据自查要点编码查询要点详情\n@param inspectPointCode 自查要点编码\n@return 自查要点详情结果\n",
        request: [
          {
            id: "#InspectionManager-queryInspectionDetailByCode-request-0",
            title: "inspectPointCode",
            description: "自查要点编码",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/InspectionPointDetailBO",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-queryInspectionDetailByCode-request-0",
              name: "inspectPointCode",
              description: "自查要点编码",
              type: "string",
              schema: {
                type: "string",
              },
              extensions: {
                "x-java-type": "java.lang.String",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/InspectionPointDetailBO",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.queryInspectionDetailByCode",
          artifactId: "",
        },
      },
    },
    "InspectionManager.queryInspectionList": {
      meta: {
        namespace: "InspectionManager",
        method: "queryInspectionList",
        description:
          "自查要点列表查询\n@param inspectionPointQuery 自查要点查询条件\n@return 自查要点列表结果\n",
        request: [
          {
            id: "#InspectionManager-queryInspectionList-request-0",
            title: "inspectionPointQuery",
            description: "自查要点查询条件",
            $ref: "#/definitions/InspectionPointQueryRequest",
            schema: {
              $ref: "#/definitions/InspectionPointQueryRequest",
            },
          },
        ],
        response: {
          $ref: "#/definitions/InspectionPointListResultBO",
        },
      },
      protocols: {
        tr: {
          parameters: [
            {
              id: "#InspectionManager-queryInspectionList-request-0",
              name: "inspectionPointQuery",
              description: "自查要点查询条件",
              schema: {
                $ref: "#/definitions/InspectionPointQueryRequest",
              },
              extensions: {
                "x-java-type":
                  "com.alipay.transparent.reg.service.impl.inspection.param.query.InspectionPointQueryRequest",
              },
            },
          ],
          responses: {
            $ref: "#/definitions/InspectionPointListResultBO",
          },
          package:
            "com.alipay.transparent.reg.service.impl.inspection.manager.InspectionManager.queryInspectionList",
          artifactId: "",
        },
      },
    },
    "OperateLogController.queryOperateLog": {
      meta: {
        namespace: "OperateLogController",
        method: "queryOperateLog",
        description:
          "查询日志\n@param beginTime\n@param endTime\n@param pageNo\n@param pageSize\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#OperateLogController-queryOperateLog-request-0",
            title: "beginTime",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-1",
            title: "endTime",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-2",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-3",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/operateLogController/queryOperateLog.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-3",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "OperateLogController.queryOperateLogUsingPOST": {
      meta: {
        namespace: "OperateLogController",
        method: "queryOperateLogUsingPOST",
        description:
          "查询日志\n@param beginTime\n@param endTime\n@param pageNo\n@param pageSize\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#OperateLogController-queryOperateLog-request-0",
            title: "beginTime",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-1",
            title: "endTime",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-2",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#OperateLogController-queryOperateLog-request-3",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/operateLogController/queryOperateLog.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#OperateLogController-queryOperateLog-request-3",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.getRegulationDetail": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "getRegulationDetail",
        description: "制度文件详情",
        contentType: "application/json",
        request: [
          {
            id: "#RegCompanySystemController-getRegulationDetail-request-0",
            title: "docId",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
          {
            id: "#RegCompanySystemController-getRegulationDetail-request-1",
            title: "versionId",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regCompanySystem/getRegulationDetail.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-getRegulationDetail-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-getRegulationDetail-request-1",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.getRegulationDetailUsingPOST": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "getRegulationDetailUsingPOST",
        description: "制度文件详情",
        contentType: "application/json",
        request: [
          {
            id: "#RegCompanySystemController-getRegulationDetail-request-0",
            title: "docId",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
          {
            id: "#RegCompanySystemController-getRegulationDetail-request-1",
            title: "versionId",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regCompanySystem/getRegulationDetail.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-getRegulationDetail-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-getRegulationDetail-request-1",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.pageQueryByFacade": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "pageQueryByFacade",
        description: "分页查询制度信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-0",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-1",
            title: "pageNum",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-2",
            title: "name",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-3",
            title: "belongToDeptNo",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regCompanySystem/pageQueryByFacade.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-3",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.pageQueryByFacadeUsingPOST": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "pageQueryByFacadeUsingPOST",
        description: "分页查询制度信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-0",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-1",
            title: "pageNum",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-2",
            title: "name",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegCompanySystemController-pageQueryByFacade-request-3",
            title: "belongToDeptNo",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regCompanySystem/pageQueryByFacade.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegCompanySystemController-pageQueryByFacade-request-3",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.queryMetaBuTree": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "queryMetaBuTree",
        description: "部门列表查询",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regCompanySystem/queryMetaBuTree.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegCompanySystemController.queryMetaBuTreeUsingPOST": {
      meta: {
        namespace: "RegCompanySystemController",
        method: "queryMetaBuTreeUsingPOST",
        description: "部门列表查询",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regCompanySystem/queryMetaBuTree.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.delete": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "delete",
        description: "删除会议信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-delete-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/delete",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-delete-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.deleteUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "deleteUsingPOST",
        description: "删除会议信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-delete-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/delete",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-delete-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.insert": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "insert",
        description: "新增会议信息\n@param fileType\n@param request\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-insert-request-0",
            title: "meetingFileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-2",
            title: "meetingName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-3",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-4",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-5",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/insert",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.insertBuFile": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "insertBuFile",
        description: "新增业务文件",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-2",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-3",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-4",
            title: "uploadFile",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/insertBuFile",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-4",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.insertBuFileUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "insertBuFileUsingPOST",
        description: "新增业务文件",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-2",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-3",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insertBuFile-request-4",
            title: "uploadFile",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/insertBuFile",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insertBuFile-request-4",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.insertUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "insertUsingPOST",
        description: "新增会议信息\n@param fileType\n@param request\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-insert-request-0",
            title: "meetingFileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-2",
            title: "meetingName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-3",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-4",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-insert-request-5",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/insert",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-insert-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryBuFileList": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryBuFileList",
        description: "文件披露：查询业务文件列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-2",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-3",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryBuFileList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryBuFileListUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryBuFileListUsingPOST",
        description: "文件披露：查询业务文件列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-2",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-3",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryBuFileList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryBuFileList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryBuFileList-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryFileTypeList": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryFileTypeList",
        description: "查询收文单位列表数据\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryFileTypeList-request-0",
            title: "subordinate",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryFileTypeList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryFileTypeList-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryFileTypeListUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryFileTypeListUsingPOST",
        description: "查询收文单位列表数据\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryFileTypeList-request-0",
            title: "subordinate",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryFileTypeList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryFileTypeList-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryFileTypes": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryFileTypes",
        description: "查询文件类型",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryFileTypes.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryFileTypesUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryFileTypesUsingPOST",
        description: "查询文件类型",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryFileTypes.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryOperBuFileList": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryOperBuFileList",
        description: "运维管理：查询业务文件列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-2",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-3",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryOperBuFileList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryOperBuFileListUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryOperBuFileListUsingPOST",
        description: "运维管理：查询业务文件列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-0",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-1",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-2",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-3",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryOperBuFileList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryOperBuFileList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryOperBuFileList-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRecordUrl": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRecordUrl",
        description: "获取临时预览连接\n@param recordUrl\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRecordUrl-request-0",
            title: "recordUrl",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryRecordUrl",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRecordUrl-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRecordUrlUsingDELETE": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRecordUrlUsingDELETE",
        description: "获取临时预览连接\n@param recordUrl\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRecordUrl-request-0",
            title: "recordUrl",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/fc/regMeetingRecord/queryRecordUrl",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRecordUrl-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRegMeetingById": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRegMeetingById",
        description: "查询会议详情\n@param id\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRegMeetingById-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryRegMeetingById.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMeetingById-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRegMeetingByIdUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRegMeetingByIdUsingPOST",
        description: "查询会议详情\n@param id\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRegMeetingById-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryRegMeetingById.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMeetingById-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRegMettingList": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRegMettingList",
        description: "查询会议列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-0",
            title: "meetingRecordName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-1",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-2",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-3",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-4",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-5",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-6",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-7",
            title: "displayed",
            type: "boolean",
            schema: {
              type: "boolean",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-8",
            title: "descOrAsc",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/queryRegMettingList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-7",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-8",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.queryRegMettingListUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "queryRegMettingListUsingPOST",
        description: "查询会议列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-0",
            title: "meetingRecordName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-1",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-2",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-3",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-4",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-5",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-6",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-7",
            title: "displayed",
            type: "boolean",
            schema: {
              type: "boolean",
            },
          },
          {
            id: "#RegMeetingRecordDOController-queryRegMettingList-request-8",
            title: "descOrAsc",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/queryRegMettingList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-7",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-queryRegMettingList-request-8",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.update": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "update",
        description: "修改会议信息\n@param fileType\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-update-request-0",
            title: "meetingFileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-1",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-2",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-3",
            title: "meetingName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-4",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-5",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-6",
            title: "delIds",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-7",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/update",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-7",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.updateBuFile": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "updateBuFile",
        description: "修改业务文件",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-0",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-1",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-2",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-3",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-4",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-5",
            title: "uploadFile",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/updateBuFile",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.updateBuFileUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "updateBuFileUsingPOST",
        description: "修改业务文件",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-0",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-1",
            title: "fileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-2",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-3",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-4",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-updateBuFile-request-5",
            title: "uploadFile",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/updateBuFile",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-updateBuFile-request-5",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.updateUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "updateUsingPOST",
        description: "修改会议信息\n@param fileType\n",
        contentType: "application/json",
        request: [
          {
            id: "#RegMeetingRecordDOController-update-request-0",
            title: "meetingFileName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-1",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-2",
            title: "fileType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-3",
            title: "meetingName",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-4",
            title: "meetingType",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-5",
            title: "meetingDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-6",
            title: "delIds",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegMeetingRecordDOController-update-request-7",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/update",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegMeetingRecordDOController-update-request-7",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.uploadFile": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "uploadFile",
        description: "文件上传",
        contentType: "multipart/form-data",
        request: [
          {
            id: "#RegMeetingRecordDOController-uploadFile-request-0",
            title: "file",
            type: "file",
            format: "binary",
            schema: {
              type: "file",
              format: "binary",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regMeetingRecord/uploadFile.json",
          parameters: [
            {
              in: "file",
              schema: {
                $ref: "#RegMeetingRecordDOController-uploadFile-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegMeetingRecordDOController.uploadFileUsingPOST": {
      meta: {
        namespace: "RegMeetingRecordDOController",
        method: "uploadFileUsingPOST",
        description: "文件上传",
        contentType: "multipart/form-data",
        request: [
          {
            id: "#RegMeetingRecordDOController-uploadFile-request-0",
            title: "file",
            type: "file",
            format: "binary",
            schema: {
              type: "file",
              format: "binary",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regMeetingRecord/uploadFile.json",
          parameters: [
            {
              in: "file",
              schema: {
                $ref: "#RegMeetingRecordDOController-uploadFile-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.delete": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "delete",
        description: "删除发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-delete-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/delete",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-delete-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.deleteUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "deleteUsingPOST",
        description: "删除发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-delete-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/delete",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-delete-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.insert": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "insert",
        description: "新增发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-insert-request-0",
            title: "postDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-1",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-2",
            title: "fileSymbol",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-3",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-4",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/insert",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-4",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.insertUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "insertUsingPOST",
        description: "新增发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-insert-request-0",
            title: "postDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-1",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-2",
            title: "fileSymbol",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-3",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-insert-request-4",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/insert",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-insert-request-4",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryFileUrl": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryFileUrl",
        description: "获取临时预览连接\n@param fileUrl\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryFileUrl-request-0",
            title: "fileUrl",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/queryFileUrl",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryFileUrl-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryFileUrlUsingDELETE": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryFileUrlUsingDELETE",
        description: "获取临时预览连接\n@param fileUrl\n@return \n",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryFileUrl-request-0",
            title: "fileUrl",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/fc/regPostFile/queryFileUrl",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryFileUrl-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryReceiveInstitutionList": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryReceiveInstitutionList",
        description: "查询收文单位列表数据\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/queryReceiveInstitutionList.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryReceiveInstitutionListUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryReceiveInstitutionListUsingPOST",
        description: "查询收文单位列表数据\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/queryReceiveInstitutionList.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryRegPostFileByID": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryRegPostFileByID",
        description: "查询发文信息详情",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryRegPostFileByID-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/queryRegPostFileByID.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostFileByID-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryRegPostFileByIDUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryRegPostFileByIDUsingPOST",
        description: "查询发文信息详情",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryRegPostFileByID-request-0",
            title: "id",
            type: "integer",
            format: "int64",
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/queryRegPostFileByID.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostFileByID-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryRegPostList": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryRegPostList",
        description: "对外发文列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryRegPostList-request-0",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-1",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-2",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-3",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-6",
            title: "displayed",
            type: "boolean",
            schema: {
              type: "boolean",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-7",
            title: "descOrAsc",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/queryRegPostList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-7",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.queryRegPostListUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "queryRegPostListUsingPOST",
        description: "对外发文列表",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-queryRegPostList-request-0",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-1",
            title: "startDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-2",
            title: "endDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-3",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-4",
            title: "pageNo",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-5",
            title: "pageSize",
            type: "integer",
            format: "int32",
            schema: {
              type: "integer",
              format: "int32",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-6",
            title: "displayed",
            type: "boolean",
            schema: {
              type: "boolean",
            },
          },
          {
            id: "#RegPostFileDOController-queryRegPostList-request-7",
            title: "descOrAsc",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/queryRegPostList.json",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-6",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-queryRegPostList-request-7",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.update": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "update",
        description: "修改发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-update-request-0",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-1",
            title: "postDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-2",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-3",
            title: "fileSymbol",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-4",
            title: "delIds",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-5",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-6",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/regPostFile/update",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-6",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "RegPostFileDOController.updateUsingPOST": {
      meta: {
        namespace: "RegPostFileDOController",
        method: "updateUsingPOST",
        description: "修改发文信息",
        contentType: "application/json",
        request: [
          {
            id: "#RegPostFileDOController-update-request-0",
            title: "id",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-1",
            title: "postDate",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-2",
            title: "status",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-3",
            title: "fileSymbol",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-4",
            title: "delIds",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-5",
            title: "fileTitle",
            type: "string",
            schema: {
              type: "string",
            },
          },
          {
            id: "#RegPostFileDOController-update-request-6",
            title: "receiveInstitution",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/regPostFile/update",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-0",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-1",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-2",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-3",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-4",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-5",
              },
            },
            {
              in: "query",
              schema: {
                $ref: "#RegPostFileDOController-update-request-6",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "UserController.getPropertyValue": {
      meta: {
        namespace: "UserController",
        method: "getPropertyValue",
        description:
          "Gets get property value.\n@param propertyName the property name\n@return the get property value\n",
        contentType: "application/json",
        request: [
          {
            id: "#UserController-getPropertyValue-request-0",
            title: "propertyName",
            description: "the property name",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/user/getPropertyValue",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#UserController-getPropertyValue-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "UserController.getPropertyValueUsingPOST": {
      meta: {
        namespace: "UserController",
        method: "getPropertyValueUsingPOST",
        description:
          "Gets get property value.\n@param propertyName the property name\n@return the get property value\n",
        contentType: "application/json",
        request: [
          {
            id: "#UserController-getPropertyValue-request-0",
            title: "propertyName",
            description: "the property name",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/user/getPropertyValue",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#UserController-getPropertyValue-request-0",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "UserController.getSSOToken": {
      meta: {
        namespace: "UserController",
        method: "getSSOToken",
        description:
          "获取sso_token\n备注：前端的域名是transparentreg，前端直接访问工作台的getSSOTicket会导致跨域问题\n所以在后端做一个请求转发\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/user/getSSOTicket",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "UserController.getSSOTokenUsingPOST": {
      meta: {
        namespace: "UserController",
        method: "getSSOTokenUsingPOST",
        description:
          "获取sso_token\n备注：前端的域名是transparentreg，前端直接访问工作台的getSSOTicket会导致跨域问题\n所以在后端做一个请求转发\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/fc/user/getSSOTicket",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "UserController.setCookie": {
      meta: {
        namespace: "UserController",
        method: "setCookie",
        description: "设置Cookie",
        contentType: "application/json",
        request: [
          {
            id: "#UserController-setCookie-request-2",
            title: "sessionId",
            type: "string",
            schema: {
              type: "string",
            },
          },
        ],
        response: {
          $ref: "#/definitions/ApiResult",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/fc/user/setCookie",
          parameters: [
            {
              in: "query",
              schema: {
                $ref: "#UserController-setCookie-request-2",
              },
            },
          ],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/ApiResult",
              },
            },
          },
        },
      },
    },
    "WorkbenchGatewayController.gateway": {
      meta: {
        namespace: "WorkbenchGatewayController",
        method: "gateway",
        description:
          "将中台接口请求转发到工作台\n@param request\n@param response\n@return \n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/home/service/gw.json",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxy": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxy",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "GET",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingDELETE": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingDELETE",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "DELETE",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingHEAD": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingHEAD",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "HEAD",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingOPTIONS": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingOPTIONS",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "OPTIONS",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingPATCH": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingPATCH",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "PATCH",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingPOST": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingPOST",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "POST",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
    "YunfengdieController.proxyUsingPUT": {
      meta: {
        namespace: "YunfengdieController",
        method: "proxyUsingPUT",
        description:
          "Proxy.\n@param request  the request\n@param response the response\n",
        contentType: "application/json",
        request: [],
        response: {
          $ref: "#/definitions/OneApiResult_object_",
        },
      },
      protocols: {
        http: {
          method: "PUT",
          path: "/transparentreg/**",
          parameters: [],
          responses: {
            200: {
              "application/json": {
                $ref: "#/definitions/OneApiResult_object_",
              },
            },
          },
        },
      },
    },
  },
};
