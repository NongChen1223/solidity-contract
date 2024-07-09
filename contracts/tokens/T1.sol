// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "../interfaces/IExtendedERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract T1 is IERC20,Initializable  {
    string  private _name; // 代币名称
    string  private _symbol; // 代币代号
    address public owner; // 合约发布者
    address[] internal whitelistAddresses; // 存储所有白名单地址

    uint8   private _decimals; // 代币精度
    uint256 private _totalSupply; // 代币发行总量
    uint256 internal  whitelistCount; // 白名单人数计数器

    mapping(address => uint256) private _balances; // 账本映射
    mapping(address => mapping(address => uint256)) internal _allowance; // 授权记录
    mapping(address => bool) internal whitelist; //白名单映射

    // 仅限所有者修饰符
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // 仅限白名单修饰符
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "It is not in the whitelist");
        _;
    }

    /* 该函数在部署或升级时进行初始化,使用 Initializable 的目的是为了支持合约的可升级性 */
    function initialize(
        string memory _initName,
        string memory _initSymbol,
        uint8 _initDecimals,
        uint256 _initTotalSupply
    ) public initializer {
        _name = _initName;
        _symbol = _initSymbol;
        _decimals = _initDecimals;
        _totalSupply = _initTotalSupply;
        owner = msg.sender;
        _balances[owner] = _initTotalSupply;
        whitelist[owner] = true;
    }

    /*
        使用了openzeppelin的Initializable后不需要要在合约中使用传统的构造函数
        而是定义使用一个Initializable 函数
        constructor(
            string memory _initName,
            string memory _initSymbol,
            uint8 _initDecimals,
            uint256 _initTotalSupply
        ) {
            // 发布合约时设置代币名称、代号、精度和发行总量
            _name = _initName;
            _symbol = _initSymbol;
            _decimals = _initDecimals;
            _totalSupply = _initTotalSupply;
            owner = msg.sender;
            // 在合约部署时把所有的代币发行给合约发布者
            _balances[owner] = _initTotalSupply;
            // 将合约发布者添加到白名单
            whitelist[owner] = true;
        }
    */

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    //授权事件
    function approve(address _spender, uint256 _value)
    external
    override
    returns (bool success)
    {
        // 设置授权额度
        _allowance[msg.sender][_spender] = _value;
        // 触发授权事件
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //转账事件
    function transfer(address _to, uint256 _value)
    external
    override
    returns (bool success)
    {
        // 检查发送者余额是否足够
        require(_balances[msg.sender] >= _value, "Insufficient balance");
        // 扣除发送者余额
        _balances[msg.sender] -= _value;
        // 增加接收者余额
        _balances[_to] += _value;
        // 触发转账事件
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //从指定地址转账函数
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external override returns (bool success) {
        // 检查发送者余额是否足够
        require(_balances[_from] >= _value, "Insufficient balance");
        // 检查授权额度是否足够
        require(
            _allowance[_from][msg.sender] >= _value,
            "Insufficient allowance"
        );
        // 扣除发送者余额
        _balances[_from] -= _value;
        // 增加接收者余额
        _balances[_to] += _value;
        // 扣除授权额度
        _allowance[_from][msg.sender] -= _value;
        // 触发转账事件
        emit Transfer(_from, _to, _value);
        return true;
    }

    //代币目前剩余
    function balanceOf(address account)
    external
    view
    override
    returns (uint256 balance)
    {
        return _balances[account];
    }

    //代币销毁,仅限白名单进行使用
    function burn(uint256 amount) external onlyWhitelisted returns (bool success) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }

    //铸造代币函数，仅限白名单调用
    function mint(uint256 amount) external onlyWhitelisted  returns (bool success) {
        _balances[msg.sender] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
        return true;
    }

    function allowance(address _owner, address _spender)
    external
    view
    override
    returns (uint256 remaining)
    {
        return _allowance[_owner][_spender];
    }

    // 添加地址到白名单，仅限合约所有者调用 其中virtual 主要作用是允许子合约修改父合约中定义的函数行为 可以被子合约重写
    function addToWhitelist(address _address) external virtual  onlyOwner {
        whitelist[_address] = true;
    }

    // 从白名单移除地址，仅限合约所有者调用
    function removeFromWhitelist(address _address) external virtual onlyOwner {
        whitelist[_address] = false;
    }
}
